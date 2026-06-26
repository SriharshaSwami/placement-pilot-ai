import applicationRepository from '../repositories/application.repository.js';
import CustomError from '../errors/CustomError.js';
import geminiAdapter from '../ai/adapters/gemini.adapter.js';
import { validateSchema } from '../ai/validators/schema.validator.js';
import { buildInsightsPrompt } from '../ai/prompts/application/insights.prompt.js';
import { applicationInsightsSchema } from '../ai/schemas/applicationInsights.schema.js';

class ApplicationService {
  async createApplication(userId, data) {
    return applicationRepository.create({ ...data, userId });
  }

  async listApplications(userId, query) {
    const filters = {};
    if (query.stage) filters.stage = query.stage;
    return applicationRepository.findByUserId(userId, filters);
  }

  async getApplication(userId, id) {
    const app = await applicationRepository.findById(id);
    if (!app || app.userId.toString() !== userId.toString()) {
      throw new CustomError('Application not found', 404);
    }
    return app;
  }

  async updateApplication(userId, id, updateData) {
    await this.getApplication(userId, id); // Verify ownership
    return applicationRepository.updateById(id, updateData);
  }

  async deleteApplication(userId, id) {
    await this.getApplication(userId, id); // Verify ownership
    return applicationRepository.deleteById(id);
  }

  async generateInsights(userId, id) {
    const app = await this.getApplication(userId, id);

    const promptBuilder = buildInsightsPrompt(app);
    
    const { parsedJSON } = await geminiAdapter.generateStructuredJSON(
      promptBuilder.buildContent(),
      applicationInsightsSchema,
      promptBuilder.getSystemInstruction()
    );

    validateSchema(parsedJSON, applicationInsightsSchema.required);

    parsedJSON.lastGeneratedAt = new Date();
    app.aiInsights = parsedJSON;
    return app.save();
  }
}

export default new ApplicationService();
