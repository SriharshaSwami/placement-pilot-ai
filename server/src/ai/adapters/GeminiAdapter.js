import CustomError from '../../../errors/CustomError.js';
import config from '../../../config/index.js';
// import { GoogleGenerativeAI } from '@google/generative-ai'; // To be installed when features are built

class GeminiAdapter {
  constructor() {
    this.apiKey = config.gemini.apiKey;
    // this.genAI = new GoogleGenerativeAI(this.apiKey);
  }

  async generateContent(prompt, modelName = 'gemini-1.5-pro') {
    try {
      // TODO: Implement actual Gemini API call
      // const model = this.genAI.getGenerativeModel({ model: modelName });
      // const result = await model.generateContent(prompt);
      // return result.response.text();

      return Promise.resolve(`{"mock": "response for ${modelName}"}`);
    } catch (error) {
      throw new CustomError(`Gemini API Error: ${error.message}`, 502, 'AI_PROVIDER_ERROR');
    }
  }
}

export default new GeminiAdapter();
