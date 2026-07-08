import geminiAdapter from '../ai/adapters/gemini.adapter.js';
import { buildTailoringPrompt } from '../ai/prompts/resume/tailor.prompt.js';
import { buildTargetedPrompt } from '../ai/prompts/resume/targeted.prompt.js';
import { resumeTailoringSchema } from '../ai/schemas/resumeTailoring.schema.js';
import { validateSchema } from '../ai/validators/schema.validator.js';
import TailoringSession from '../models/TailoringSession.js';
import resumeRepository from '../repositories/resume.repository.js';
import jobRepository from '../repositories/job.repository.js';
import CustomError from '../errors/CustomError.js';

class TailoringService {
  hasStructuredContent(structuredData) {
    if (!structuredData) return false;
    if (structuredData.professionalSummary?.value) return true;
    if (structuredData.experience && structuredData.experience.length > 0) return true;
    if (structuredData.education && structuredData.education.length > 0) return true;
    if (structuredData.projects && structuredData.projects.length > 0) return true;
    if (structuredData.skills) {
      for (const category of Object.values(structuredData.skills)) {
        if (Array.isArray(category) && category.length > 0) return true;
      }
    }
    return false;
  }

  async generateTailoringSession(userId, jobId, resumeId, forceRegenerate = false) {
    console.log(`[TailoringService] generateTailoringSession called for Job: ${jobId}, Resume: ${resumeId}`);
    // 1. Verify ownership
    const resume = await resumeRepository.findById(resumeId);
    if (!resume || resume.userId.toString() !== userId.toString()) {
      throw new CustomError('Resume not found', 404, 'NOT_FOUND');
    }
    if (!resume.parsedData || resume.parsedData?.metadata?.parsingStatus !== 'success') {
      throw new CustomError('Resume must be parsed first', 400, 'NOT_PARSED');
    }

    const job = await jobRepository.findById(jobId);
    if (!job || job.userId.toString() !== userId.toString()) {
      throw new CustomError('Job not found', 404, 'NOT_FOUND');
    }

    // 2. Caching check: ONLY cache deterministic intermediate artifacts.
    // If a session exists and has completed suggestions for this exact Job and Resume, return it.
    if (!forceRegenerate) {
      const existingSession = await TailoringSession.findOne({ userId, jobId, resumeId });
      if (existingSession) {
        // Return it whether active, completed, or failed.
        // The UI handles 'failed' by showing an error and allowing forceRegenerate=true.
        return existingSession;
      }
    }
    
    // Clear old session
    await TailoringSession.findOneAndDelete({ userId, jobId, resumeId });

    // Initialize session with Analyzing JD status
    const session = new TailoringSession({
      userId,
      jobId,
      resumeId,
      promptVersion: '2.0.0',
      modelVersion: geminiAdapter.modelName,
      generationStatus: 'analyzing_jd',
      status: 'active'
    });
    await session.save();

    // Fire-and-forget the rest of the pipeline to run asynchronously.
    // We catch errors inside to update the generationStatus to 'failed'.
    this._runTailoringPipeline(session, resume, job).catch(err => {
      console.error('[TailoringService] Pipeline failed:', err);
      require('fs').writeFileSync('C:\\Users\\sriha\\OneDrive\\Desktop\\Projects\\placement-assistance-ai\\server\\tailoring-error.log', String(err.stack || err));
      session.generationStatus = 'failed';
      session.save().catch(e => console.error('Failed to save error state', e));
    });

    // Return the session immediately so the client can start polling/subscribing
    return session;
  }

  async _runTailoringPipeline(session, resume, job) {
    try {
      // Lazy imports for new prompts/schemas to avoid circular dependencies
      const { buildJDAnalysisPrompt } = await import('../ai/prompts/resume/jdAnalysis.prompt.js');
      const { jdAnalysisSchema } = await import('../ai/schemas/jdAnalysis.schema.js');
      const { buildGapAnalysisPrompt } = await import('../ai/prompts/resume/gapAnalysis.prompt.js');
      const { gapAnalysisSchema } = await import('../ai/schemas/gapAnalysis.schema.js');
      const { buildTailorGenerationPrompt } = await import('../ai/prompts/resume/tailorGeneration.prompt.js');
      const { tailoredResumeSchema } = await import('../ai/schemas/tailoredResume.schema.js');
      const resumeDiffService = (await import('./resumeDiff.service.js')).default;

      // Stage 1: JD Analysis
      session.generationStatus = 'analyzing_jd';
      await session.save();
      
      const jdPrompt = buildJDAnalysisPrompt(job);
      // JD Analysis AI Call
      session.aiCallCount = (session.aiCallCount || 0) + 1;
      const jdRes = await geminiAdapter.generateStructuredJSON(
        jdPrompt.buildContent(),
        jdAnalysisSchema,
        jdPrompt.getSystemInstruction()
      );
      session.jdAnalysis = jdRes.parsedJSON;

      // Stage 2: Gap Analysis & Strategy
      session.generationStatus = 'gap_analysis';
      await session.save();
      
      const gapPrompt = buildGapAnalysisPrompt(resume.parsedData, session.jdAnalysis);
      // Gap Analysis AI Call
      session.aiCallCount += 1;
      const gapRes = await geminiAdapter.generateStructuredJSON(
        gapPrompt.buildContent(),
        gapAnalysisSchema,
        gapPrompt.getSystemInstruction()
      );
      session.gapAnalysis = gapRes.parsedJSON;
      session.resumeStrategy = session.gapAnalysis.strategy;

      // Map to backwards-compatible matchAnalysis
      session.matchAnalysis = {
        overallMatchPercent: session.gapAnalysis.strongMatches?.length > 0 ? 80 : 50,
        matchedSkills: session.gapAnalysis.strongMatches || [],
        missingSkills: session.gapAnalysis.missingKeywords || [],
        matchedKeywords: session.gapAnalysis.strongMatches || [],
        missingKeywords: session.gapAnalysis.missingKeywords || [],
        resumeWeaknesses: session.gapAnalysis.missingEmphasis || []
      };

      // Stage 3: Generate Tailored Resume
      session.generationStatus = 'generating_resume';
      await session.save();
      
      const templateId = resume.selectedTemplate || 'classic';
      const { resumeRules } = await import('../config/resumeRules.js');
      const activeRules = resumeRules[templateId] || resumeRules.classic;
      
      // Compute budget based on template rules
      const contentBudget = {
        summary: `maximum ${activeRules.summary.maxLines} rendered lines`,
        experience: `maximum ${activeRules.experience.currentRoleMaxBullets * 3} bullets total`, // Approximation for total
        projects: `maximum ${activeRules.projects.totalMaxBullets} bullets total`,
        achievements: `maximum ${activeRules.achievements.totalMaxBullets} bullets`,
        skills: `maximum ${activeRules.skills.maxRows} rows`
      };

      const tailorPrompt = buildTailorGenerationPrompt(resume.parsedData, session.jdAnalysis, session.gapAnalysis, contentBudget);
      // Tailoring AI Call
      session.aiCallCount += 1;
      const tailorRes = await geminiAdapter.generateStructuredJSON(
        tailorPrompt.buildContent(),
        tailoredResumeSchema,
        tailorPrompt.getSystemInstruction()
      );
      session.tailoredStructuredResume = tailorRes.parsedJSON.tailoredStructuredData;
      session.validationScores = tailorRes.parsedJSON.validationScores;

      // Stage 3.5: Measure Fit & Compress
      session.generationStatus = 'measuring_fit';
      await session.save();
      
      const resumeFitService = (await import('./resumeFit.service.js')).default;
      const resumeCompressionService = (await import('./resumeCompression.service.js')).default;
      
      let currentData = session.tailoredStructuredResume;
      let fitReport = null;

      for (let level = 0; level <= 5; level++) {
        if (level > 0) {
          console.log(`[TailoringService] Resume overflows by ${fitReport.overflowPixels}px. Applying Compression Level ${level}...`);
          currentData = resumeCompressionService.compress(session.tailoredStructuredResume, level);
        }

        fitReport = await resumeFitService.evaluateFit(
          currentData, 
          resume.selectedTemplate || 'classic'
        );

        if (fitReport.fits) {
          console.log(`[TailoringService] Fit achieved at Level ${level}.`);
          break;
        }
      }

      session.tailoredStructuredResume = currentData;
      session.fitReport = fitReport;
      if (fitReport.fits === false) {
        console.warn(`[TailoringService] Warning: Resume still overflows after Level 5 compression. Triggering Emergency AI Compression...`);
        session.generationStatus = 'emergency_compression';
        await session.save();

        try {
          const { buildEmergencyCompressionPrompt } = await import('../ai/prompts/resume/emergencyCompression.prompt.js');
          const { emergencyCompressionSchema } = await import('../ai/schemas/emergencyCompression.schema.js');

          if (session.aiCallCount >= 4) {
            throw new Error('Maximum AI call limit (4) exceeded. Cannot perform Emergency Compression.');
          }

          // Emergency Compression AI Call
          session.aiCallCount += 1;
          const emergencyPrompt = buildEmergencyCompressionPrompt(currentData, fitReport.overflowPixels, fitReport.overflowSections);
          const emergencyRes = await geminiAdapter.generateStructuredJSON(
            emergencyPrompt.buildContent(),
            emergencyCompressionSchema,
            emergencyPrompt.getSystemInstruction()
          );

          const modifiedSections = emergencyRes.parsedJSON.modifiedSections || {};
          
          // Merge modified sections back into currentData
          Object.keys(modifiedSections).forEach(sectionKey => {
            const updates = modifiedSections[sectionKey];
            if (currentData[sectionKey]) {
              if (Array.isArray(updates)) {
                // It's an array of objects (like experience/projects) with an index
                updates.forEach(update => {
                  if (update.index !== undefined && currentData[sectionKey][update.index]) {
                    if (update.description && Array.isArray(update.description)) {
                      currentData[sectionKey][update.index].description.value = update.description.map(v => ({ value: v, confidence: 1 }));
                    }
                  }
                });
              } else if (updates.value && !Array.isArray(currentData[sectionKey])) {
                // It's a single object (like professionalSummary)
                currentData[sectionKey].value = updates.value;
              }
            }
          });

          session.tailoredStructuredResume = currentData;
          
          // Final fit measurement (optional but good to have truth)
          fitReport = await resumeFitService.evaluateFit(
            currentData, 
            resume.selectedTemplate || 'classic'
          );
          session.fitReport = fitReport;
          console.log(`[TailoringService] Emergency Compression finished. Fits: ${fitReport.fits}`);

        } catch (emergencyError) {
          console.error(`[TailoringService] Emergency Compression failed:`, emergencyError);
          // Fall back to the deterministically compressed data
        }
      }

      // Stage 3.75: Deterministic Resume Quality Evaluation
      session.generationStatus = 'validating';
      await session.save();

      const resumeQualityService = (await import('./resumeQuality.service.js')).default;
      const qualityReport = resumeQualityService.evaluate(
        session.tailoredStructuredResume, 
        session.jdAnalysis, 
        session.fitReport,
        resume.selectedTemplate || 'classic'
      );
      session.qualityReport = qualityReport;
      
      if (qualityReport.warnings && qualityReport.warnings.length > 0) {
        console.warn(`[TailoringService] Resume Validation Warnings:`, qualityReport.warnings);
      }

      // Stage 4: Semantic Diff & Preparing Suggestions
      session.generationStatus = 'comparing_diff';
      await session.save();
      
      const suggestions = resumeDiffService.generateSemanticDiff(
        resume.parsedData.structuredData, 
        session.tailoredStructuredResume
      );
      session.suggestions = suggestions;
      session.semanticDiff = suggestions;

      // Stage 5: Completed
      session.generationStatus = 'completed';
      session.status = 'completed';
      await session.save();

    } catch (error) {
      console.error('[TailoringService] Error during pipeline execution:', error);
      try {
        const fs = await import('fs');
        fs.writeFileSync('tailoring_error_debug.txt', error.stack || error.message);
      } catch (e) {}
      session.generationStatus = 'failed';
      try {
        await session.save();
      } catch (saveError) {
        console.error('[TailoringService] Failed to save error state to session:', saveError);
      }
    }
  }

  async generateTargetedSuggestion(userId, sessionId, targetSkill) {
    const session = await TailoringSession.findById(sessionId).populate('resumeId');
    if (!session || session.userId.toString() !== userId.toString()) {
      throw new CustomError('Session not found', 404, 'NOT_FOUND');
    }

    const promptBuilder = buildTargetedPrompt(session.resumeId.parsedData, targetSkill);
    const promptContent = promptBuilder.buildContent();

    try {
      const response = await geminiAdapter.generateStructuredJSON(
        promptContent,
        {
          type: 'object',
          properties: {
            id: { type: 'string' },
            section: { type: 'string' },
            priority: { type: 'string' },
            confidence: { type: 'number' },
            reason: { type: 'string' },
            targetPath: { type: 'string' },
            suggestedContent: { type: 'string' }
          },
          required: ['id', 'section', 'priority', 'confidence', 'reason', 'targetPath', 'suggestedContent']
        },
        promptBuilder.getSystemInstruction()
      );

      const newSuggestion = {
        ...response.parsedJSON,
        id: `targeted-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        status: 'pending'
      };

      session.suggestions.push(newSuggestion);
      await session.save();

      return newSuggestion;
    } catch (error) {
      throw new CustomError(`Failed to generate targeted suggestion: ${error.message}`, 500, 'AI_ERROR');
    }
  }

  async getSession(userId, sessionId) {
    const session = await TailoringSession.findById(sessionId).populate('jobId').populate('resumeId');
    if (!session || session.userId.toString() !== userId.toString()) {
      throw new CustomError('Session not found', 404, 'NOT_FOUND');
    }
    return session;
  }

  async getSessionByJobAndResume(userId, jobId, resumeId) {
    let session = await TailoringSession.findOne({ userId, jobId, resumeId });
    if (!session) {
      const resume = await resumeRepository.findById(resumeId);
      if (resume && resume.parentResumeId) {
        session = await TailoringSession.findOne({ userId, jobId, resumeId: resume.parentResumeId });
      }
    }
    return session;
  }

  async updateSuggestionStatus(userId, sessionId, suggestionId, status) {
    const session = await TailoringSession.findById(sessionId);
    if (!session || session.userId.toString() !== userId.toString()) {
      throw new CustomError('Session not found', 404, 'NOT_FOUND');
    }

    const suggestion = session.suggestions.find(s => s.id === suggestionId);
    if (!suggestion) {
      throw new CustomError('Suggestion not found', 404, 'NOT_FOUND');
    }

    suggestion.status = status;
    return session.save();
  }

  async batchUpdateSuggestions(userId, sessionId, status) {
    const session = await TailoringSession.findById(sessionId);
    if (!session || session.userId.toString() !== userId.toString()) {
      throw new CustomError('Session not found', 404, 'NOT_FOUND');
    }

    session.suggestions.forEach(s => {
      if (status === 'pending') {
        s.status = 'pending';
      } else if (s.status === 'pending') {
        s.status = status;
      }
    });

    return session.save();
  }

  async saveTailoredResume(userId, sessionId, title) {
    const session = await TailoringSession.findById(sessionId).populate('resumeId').populate('jobId');
    if (!session || session.userId.toString() !== userId.toString()) {
      throw new CustomError('Session not found', 404, 'NOT_FOUND');
    }

    const originalResume = session.resumeId;
    const job = session.jobId;

    // Build a new structured data object
    const newStructuredData = JSON.parse(JSON.stringify(originalResume.parsedData.structuredData));
    const changedSections = new Set();
    const acceptedSuggestions = session.suggestions.filter(s => s.status === 'accepted');

    for (const sug of acceptedSuggestions) {
      if (!sug.targetPath) continue;

      const keys = sug.targetPath.split('.');
      let current = newStructuredData;
      let validPath = true;

      for (let i = 0; i < keys.length - 1; i++) {
        if (current[keys[i]] === undefined) {
          validPath = false;
          break;
        }
        current = current[keys[i]];
      }

      if (validPath) {
        const lastKey = keys[keys.length - 1];
        
        // SPECIAL CASE: Reorder projects
        if (sug.targetPath === 'projects') {
            const newTitles = sug.suggestedContent.split('\n').map(t => t.trim()).filter(Boolean);
            const oldProjects = current[lastKey] || [];
            const newProjects = [];
            for (const title of newTitles) {
                const p = oldProjects.find(op => (op.title?.value || op.title) === title);
                if (p) newProjects.push(p);
            }
            if (newProjects.length > 0) {
               current[lastKey] = newProjects;
               changedSections.add(keys[0]);
            }
            continue;
        }
        
        // SPECIAL CASE: Achievements
        if (sug.targetPath === 'achievements') {
            const newDescriptions = sug.suggestedContent.split('\n').map(d => d.trim()).filter(Boolean);
            const newAchievements = [];
            for (let i = 0; i < newDescriptions.length; i++) {
                const oldAch = (current[lastKey] && current[lastKey][i]) || {};
                newAchievements.push({
                   title: oldAch.title || { value: `Achievement ${i+1}`, confidence: 1 },
                   description: { value: newDescriptions[i], confidence: 1 }
                });
            }
            current[lastKey] = newAchievements;
            changedSections.add(keys[0]);
            continue;
        }

        if (current[lastKey] !== undefined) {
          if (Array.isArray(current[lastKey])) {
              const separator = keys[0] === 'skills' ? ',' : '\n';
              const items = sug.suggestedContent.split(separator).map(s => s.trim()).filter(Boolean);
              current[lastKey] = items.map(val => ({ value: val, confidence: 1 }));
          } else if (typeof current[lastKey] === 'object' && current[lastKey] !== null && 'value' in current[lastKey]) {
            current[lastKey].value = sug.suggestedContent;
          } else {
            current[lastKey] = { value: sug.suggestedContent, confidence: 1 };
          }
          changedSections.add(keys[0]);
        }
      }
    }

    // Determine the highest version for this parent
    const parentId = originalResume.parentResumeId || originalResume._id;
    const versionsCount = await resumeRepository.count({ parentResumeId: parentId });
    const nextVersion = originalResume.parentResumeId ? originalResume.version + 1 : 2;

    const summaryStr = changedSections.size > 0 
      ? `Tailored sections: ${Array.from(changedSections).join(', ')}` 
      : 'No sections changed (Base duplicate)';

    // Create a new resume version in db
    const newResume = await resumeRepository.create({
      userId,
      title: title || `${originalResume.title} (Tailored for ${job.company}) v${nextVersion}`,
      originalFilename: originalResume.originalFilename,
      cloudinaryPublicId: originalResume.cloudinaryPublicId,
      cloudinaryUrl: originalResume.cloudinaryUrl,
      fileSize: originalResume.fileSize,
      mimeType: originalResume.mimeType,
      isPrimary: false,
      version: nextVersion,
      parentResumeId: parentId,
      jobId: job._id,
      tailoringSummary: summaryStr,
      parsedData: {
        ...originalResume.parsedData,
        structuredData: newStructuredData
      },
      uploadStatus: 'completed'
    });

    session.status = 'completed';
    await session.save();

    return newResume;
  }
}

export default new TailoringService();
