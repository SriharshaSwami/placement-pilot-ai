import geminiAdapter from '../ai/adapters/gemini.adapter.js';
import { buildAnalyzeResumePrompt } from '../ai/prompts/resume/analyze.prompt.js';
import { resumeAnalysisSchema } from '../ai/schemas/resumeAnalysis.schema.js';
import { validateSchema } from '../ai/validators/schema.validator.js';
import ResumeAnalysis from '../models/ResumeAnalysis.js';
import resumeRepository from '../repositories/resume.repository.js';
import CustomError from '../errors/CustomError.js';

class ResumeAnalysisService {
  async analyzeResume(userId, resumeId) {
    // 1. Verify ownership and get resume data
    const resume = await resumeRepository.findById(resumeId);
    if (!resume || resume.userId.toString() !== userId.toString()) {
      throw new CustomError('Resume not found or unauthorized', 404, 'NOT_FOUND');
    }

    if (!resume.parsedData || !resume.parsedData.sections) {
      throw new CustomError('Resume must be parsed before analysis. Missing parsedData.', 400, 'NOT_PARSED');
    }

    // 2. Check if an analysis already exists to avoid redundant AI calls
    let existingAnalysis = await ResumeAnalysis.findOne({ resumeId }).select('-rawResponse');
    if (existingAnalysis) {
      return existingAnalysis;
    }

    // 3. Build Prompt
    const promptBuilder = buildAnalyzeResumePrompt(resume.parsedData);
    const systemInstruction = promptBuilder.getSystemInstruction();
    const promptContent = promptBuilder.buildContent();

    // 4. Call AI Adapter
    const { parsedJSON, rawText } = await geminiAdapter.generateStructuredJSON(
      promptContent,
      resumeAnalysisSchema,
      systemInstruction
    );

    // 5. Validate Output strictly
    validateSchema(parsedJSON, resumeAnalysisSchema.required);

    // 6. Save Structured Output to DB
    const newAnalysis = new ResumeAnalysis({
      resumeId,
      userId,
      analysisVersion: '1.0.0',
      modelUsed: geminiAdapter.modelName,
      promptVersion: '1.0.0',
      ...parsedJSON,
      rawResponse: rawText // Kept for debugging/audit, normally not selected
    });

    await newAnalysis.save();

    // Exclude rawResponse from the returned object
    const analysisObj = newAnalysis.toObject();
    delete analysisObj.rawResponse;

    return analysisObj;
  }

  async getAnalysis(userId, resumeId) {
    const analysis = await ResumeAnalysis.findOne({ resumeId, userId }).select('-rawResponse');
    if (!analysis) {
      return null;
    }
    return analysis;
  }
}

export default new ResumeAnalysisService();
