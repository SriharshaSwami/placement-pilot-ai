import geminiAdapter from '../ai/adapters/gemini.adapter.js';
import { buildTailoringPrompt } from '../ai/prompts/resume/tailor.prompt.js';
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

    const job = await jobRepository.findById(jobId);
    if (!job || job.userId.toString() !== userId.toString()) {
      throw new CustomError('Job not found', 404, 'NOT_FOUND');
    }

    // 2. Check cache (active session)
    const existingSession = await TailoringSession.findOne({ userId, jobId, resumeId });
    if (existingSession) {
      return existingSession;
    }

    // 3. Build AI Prompt
    const promptBuilder = buildTailoringPrompt(resume.parsedData, job);
    const systemInstruction = promptBuilder.getSystemInstruction();
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

            // Adjust based on edit type size
            const origWords = (sug.originalContent || '').split(/\s+/).filter(Boolean).length;
            const sugWords = (sug.suggestedContent || '').split(/\s+/).filter(Boolean).length;
            if (origWords > 0 && Math.abs(origWords - sugWords) < 3) {
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

  async getSession(userId, sessionId) {
    const session = await TailoringSession.findById(sessionId).populate('jobId').populate('resumeId');
    if (!session || session.userId.toString() !== userId.toString()) {
      throw new CustomError('Session not found', 404, 'NOT_FOUND');
    }
    return session;
  }

  async getSessionByJobAndResume(userId, jobId, resumeId) {
    const session = await TailoringSession.findOne({ userId, jobId, resumeId });
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

    // Apply accepted suggestions to the sections Map
    const sections = new Map(originalResume.parsedData.sections);
    const acceptedSuggestions = session.suggestions.filter(s => s.status === 'accepted');

    for (const sug of acceptedSuggestions) {
      let matchedKey = null;
      for (const key of sections.keys()) {
        if (key.toLowerCase().replace(/[^a-z]/g, '') === sug.section.toLowerCase().replace(/[^a-z]/g, '')) {
          matchedKey = key;
          break;
        }
      }

      if (matchedKey) {
        let currentText = sections.get(matchedKey) || '';
        if (sug.originalContent) {
          currentText = currentText.replace(sug.originalContent, sug.suggestedContent);
        } else {
          currentText += '\n' + sug.suggestedContent;
        }
        sections.set(matchedKey, currentText);
      }
    }

    // Create a new resume version in db
    const newResume = await resumeRepository.create({
      userId,
      title: title || `${originalResume.title} (Tailored for ${job.company})`,
      originalFilename: originalResume.originalFilename,
      cloudinaryPublicId: originalResume.cloudinaryPublicId,
      cloudinaryUrl: originalResume.cloudinaryUrl,
      fileSize: originalResume.fileSize,
      mimeType: originalResume.mimeType,
      isPrimary: false,
      parsedData: {
        ...originalResume.parsedData,
        sections: Object.fromEntries(sections),
      },
      uploadStatus: 'completed'
    });

    session.status = 'completed';
    await session.save();

    return newResume;
  }
}

export default new TailoringService();
