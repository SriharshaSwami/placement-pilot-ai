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
  async generateTailoringSession(userId, jobId, resumeId) {
    // 1. Verify ownership
    const resume = await resumeRepository.findById(resumeId);
    if (!resume || resume.userId.toString() !== userId.toString()) {
      throw new CustomError('Resume not found', 404, 'NOT_FOUND');
    }
    if (!resume.parsedData) {
      throw new CustomError('Resume must be parsed first', 400, 'NOT_PARSED');
    }

    if (!resume.parsedData.structuredData) {
      const resumeParserService = (await import('./parser/resumeParser.service.js')).default;
      resume.parsedData = await resumeParserService.createStructuredResume(resumeId);
    }

    const job = await jobRepository.findById(jobId);
    if (!job || job.userId.toString() !== userId.toString()) {
      throw new CustomError('Job not found', 404, 'NOT_FOUND');
    }

    // 2. Check cache (active session)
    const existingSession = await TailoringSession.findOne({ userId, jobId, resumeId });
    if (existingSession) {
      return existingSession;
    }

    // Optional: Calculate embedding similarity
    let similarityScore = null;
    if (resume.embedding && job.embedding) {
      try {
        const embeddingService = (await import('../embedding.service.js')).default;
        similarityScore = embeddingService.calculateSimilarity(resume.embedding, job.embedding);
      } catch (err) {
        console.error('[TailoringService] Failed to calculate similarity:', err.message);
      }
    }

    // 3. Build AI Prompt
    const promptBuilder = buildTailoringPrompt(resume.parsedData, job);
    
    // Inject similarity context if available
    let systemInstruction = promptBuilder.getSystemInstruction();
    if (similarityScore !== null) {
      systemInstruction += `\n\nContext: The semantic similarity score between this resume and job description is ${(similarityScore * 100).toFixed(1)}%. Use this as an indicator of how much tailoring is needed (lower score = more aggressive tailoring required).`;
    }

    const promptContent = promptBuilder.buildContent();

    let parsedJSON;
    let attempts = 0;
    const maxAttempts = 2;

    while (attempts < maxAttempts) {
      try {
        attempts++;
        // 4. Call AI Adapter
        const response = await geminiAdapter.generateStructuredJSON(
          promptContent,
          resumeTailoringSchema,
          systemInstruction
        );
        parsedJSON = response.parsedJSON;

        // 5. Validate Output
        validateSchema(parsedJSON, resumeTailoringSchema.required);

        // Calibrate confidence scores
        if (parsedJSON.suggestions && Array.isArray(parsedJSON.suggestions)) {
          const missingKeywords = parsedJSON.matchAnalysis?.missingKeywords || [];
          parsedJSON.suggestions.forEach(sug => {
            let conf = sug.confidence || 85;
            
            // Adjust based on priority
            if (sug.priority === 'High') conf += 5;
            if (sug.priority === 'Low') conf -= 10;

            // Adjust based on edit type size (Not using originalContent anymore)
            const sugWords = (sug.suggestedContent || '').split(/\s+/).filter(Boolean).length;
            if (sugWords > 0 && sugWords < 5) {
              // Very small minor wording improvement
              conf -= 15;
            }

            // Adjust based on missing keywords inclusion
            const containsMissingKeyword = missingKeywords.some(kw => 
              sug.suggestedContent.toLowerCase().includes(kw.toLowerCase())
            );
            if (containsMissingKeyword) {
              conf += 10;
            }

            // Clamp confidence between 50 and 98 to make it look realistic and not generic
            sug.confidence = Math.max(50, Math.min(98, Math.round(conf)));
          });
        }
        break;
      } catch (error) {
        console.warn(`[TailoringService] Attempt ${attempts} failed: ${error.message}`);
        if (attempts >= maxAttempts) {
          throw new CustomError(
            `Failed to generate valid tailoring suggestions after ${maxAttempts} attempts: ${error.message}`,
            500,
            'AI_VALIDATION_ERROR'
          );
        }
      }
    }

    // 6. Save DB
    const newSession = new TailoringSession({
      userId,
      jobId,
      resumeId,
      promptVersion: '1.0.0',
      modelVersion: geminiAdapter.modelName,
      matchAnalysis: parsedJSON.matchAnalysis,
      suggestions: parsedJSON.suggestions,
      status: 'active'
    });

    return newSession.save();
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
        if (current[lastKey] !== undefined) {
          if (typeof current[lastKey] === 'object' && current[lastKey] !== null && 'value' in current[lastKey]) {
            current[lastKey].value = sug.suggestedContent;
          } else {
            current[lastKey] = sug.suggestedContent;
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
