import geminiAdapter from '../ai/adapters/gemini.adapter.js';
import { validateSchema } from '../ai/validators/schema.validator.js';
import { buildCoachingPrompt } from '../ai/prompts/interview/coaching.prompt.js';
import { coachingReportSchema } from '../ai/schemas/coachingReport.schema.js';
import logger from '../utils/logger.js';
import InterviewSession from '../models/InterviewSession.js';

class CoachingService {
  async generateCoachingReport(session) {
    try {
      logger.info(`[CoachingService] Starting deep coaching analysis for session ${session._id}`);
      
      const parsedResume = session.resumeId?.parsedData || null;
      const parsedJob = session.jobId || null;
      
      const promptBuilder = buildCoachingPrompt(session, parsedResume, parsedJob);
      
      const { parsedJSON } = await geminiAdapter.generateStructuredJSON(
        promptBuilder.buildContent(),
        coachingReportSchema,
        promptBuilder.getSystemInstruction()
      );

      validateSchema(parsedJSON, coachingReportSchema.required);
      
      logger.info(`[CoachingService] Successfully generated coaching report for session ${session._id}`);
      
      // Update session with the coaching report
      await InterviewSession.findByIdAndUpdate(session._id, {
        coachingReport: parsedJSON
      });
      
      return parsedJSON;
    } catch (error) {
      logger.error(`[CoachingService] Failed to generate coaching report for session ${session._id}:`, error);
      // We don't throw to prevent crashing the finishInterview flow
      return null;
    }
  }
}

export default new CoachingService();
