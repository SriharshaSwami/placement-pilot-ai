import { GoogleGenAI } from '@google/genai';
import CustomError from '../../errors/CustomError.js';
import config from '../../config/index.js';

const ai = new GoogleGenAI({ apiKey: config.gemini.apiKey });

class GeminiClient {
  constructor(modelName = 'gemini-2.5-flash') {
    this.modelName = modelName;
  }

  async generateStructuredJSON(promptText, schema, systemInstruction = null) {
    try {
      const config = {
        responseMimeType: 'application/json',
        responseSchema: schema,
        temperature: 0.2, // Low temperature for consistent JSON output
      };

      if (systemInstruction) {
        config.systemInstruction = systemInstruction;
      }

      const response = await ai.models.generateContent({
        model: this.modelName,
        contents: promptText,
        config: config
      });

      const rawText = response.text;
      
      try {
        const parsedJSON = JSON.parse(rawText);
        return { parsedJSON, rawText };
      } catch (parseError) {
         throw new CustomError('Failed to parse AI response into JSON', 500, 'AI_PARSE_ERROR');
      }
    } catch (error) {
       throw new CustomError(`Gemini API Error: ${error.message}`, 502, 'AI_API_ERROR');
    }
  }

  async generateContent(promptText, model = this.modelName) {
    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: promptText
      });
      return response.text;
    } catch (error) {
       throw new CustomError(`Gemini API Error: ${error.message}`, 502, 'AI_API_ERROR');
    }
  }
}

export default new GeminiClient();
