import careerRepository from '../repositories/career.repository.js';
import resumeRepository from '../repositories/resume.repository.js';
import codingRepository from '../repositories/coding.repository.js';
import interviewRepository from '../repositories/interview.repository.js';
import statisticsService from '../services/statistics.service.js';
import geminiAdapter from '../ai/adapters/gemini.adapter.js';
import { validateSchema } from '../ai/validators/schema.validator.js';
import { careerIntelligenceSchema } from '../ai/schemas/careerIntelligence.schema.js';
import { buildIntelligencePrompt } from '../ai/prompts/career/intelligence.prompt.js';
import CustomError from '../errors/CustomError.js';

class CareerService {
  async getProfile(userId) {
    return careerRepository.getProfile(userId);
  }

  async updateProfile(userId, data) {
    return careerRepository.upsertProfile(userId, data);
  }

  async getRoadmap(userId, forceRefresh = false) {
    let roadmap = await careerRepository.getRoadmap(userId);
    
    // Simple Cache Logic: 24 hour TTL unless forced
    if (roadmap && !forceRefresh) {
      const hoursSinceLastGen = (new Date() - roadmap.lastGeneratedAt) / (1000 * 60 * 60);
      if (hoursSinceLastGen < 24) return roadmap;
    }

    // 1. Gather all required cross-module context
    const profile = await careerRepository.getProfile(userId);
    if (!profile) throw new CustomError('Please complete your Career Profile first.', 400);

    const resumes = await resumeRepository.findByUserId(userId);
    const primaryResume = resumes.find(r => r.isPrimary) || resumes[0];

    const codingHistory = await codingRepository.findByUserId(userId);
    const interviewHistory = await interviewRepository.findByUserId(userId);
    const appStats = await statisticsService.getDashboardStats(userId);

    // 2. Build the aggregate prompt
    const promptBuilder = buildIntelligencePrompt(
      profile, 
      primaryResume ? primaryResume.parsedText : '',
      codingHistory,
      interviewHistory,
      appStats
    );

    // 3. Generate structured intelligence from Gemini
    const { parsedJSON } = await geminiAdapter.generateStructuredJSON(
      promptBuilder.buildContent(),
      careerIntelligenceSchema,
      promptBuilder.getSystemInstruction()
    );

    validateSchema(parsedJSON, careerIntelligenceSchema.required);

    // 4. Upsert into database
    roadmap = await careerRepository.upsertRoadmap(userId, parsedJSON);
    return roadmap;
  }

  async toggleTaskStatus(userId, taskId, status) {
    return careerRepository.updateTaskStatus(userId, taskId, status);
  }
}

export default new CareerService();
