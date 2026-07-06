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
      // Helper to strictly uppercase JSON Schema types for Google Gen AI SDK compatibility
      const sanitizeSchemaTypes = (obj) => {
        if (!obj || typeof obj !== 'object') return obj;
        if (Array.isArray(obj)) return obj.map(sanitizeSchemaTypes);
        
        const newObj = {};
        for (const [key, value] of Object.entries(obj)) {
          if (key === 'type' && typeof value === 'string') {
            newObj[key] = value.toUpperCase();
          } else {
            newObj[key] = sanitizeSchemaTypes(value);
          }
        }
        return newObj;
      };

      const strictSchema = sanitizeSchemaTypes(schema);

      const config = {
        responseMimeType: 'application/json',
        responseSchema: strictSchema,
        temperature: 0.2, // Low temperature for consistent JSON output
      };

      if (systemInstruction) {
        config.systemInstruction = systemInstruction;
      }

      const generatePromise = ai.models.generateContent({
        model: this.modelName,
        contents: promptText,
        config: config
      });
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new CustomError('Gemini API Timeout', 504, 'AI_TIMEOUT')), 30000)
      );

      const response = await Promise.race([generatePromise, timeoutPromise]);

      const rawText = response.text;
      
      try {
        const cleanText = rawText.replace(/```(?:json)?\n?/g, '').replace(/```\n?/g, '').trim();
        const parsedJSON = JSON.parse(cleanText);
        return { parsedJSON, rawText };
      } catch (parseError) {
         console.error('[GeminiClient] JSON Parse Error. Raw Text was:\n', rawText);
         throw new CustomError('Failed to parse AI response into JSON', 500, 'AI_PARSE_ERROR');
      }
    } catch (error) {
       throw new CustomError(`Gemini API Error: ${error.message}`, 502, 'AI_API_ERROR');
    }
  }

  async generateContent(promptText, systemInstruction = null, model = this.modelName) {
    try {
      const config = {};
      if (systemInstruction) {
        config.systemInstruction = systemInstruction;
      }
      const response = await ai.models.generateContent({
        model: model,
        contents: promptText,
        config: Object.keys(config).length > 0 ? config : undefined
      });
      return response.text;
    } catch (error) {
       throw new CustomError(`Gemini API Error: ${error.message}`, 502, 'AI_API_ERROR');
    }
  }

  async generateEmbeddings(text) {
    try {
      const embedPromise = ai.models.embedContent({
        model: 'gemini-embedding-2',
        contents: text,
      });

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new CustomError('Embedding API Timeout', 504, 'AI_TIMEOUT')), 15000)
      );

      const response = await Promise.race([embedPromise, timeoutPromise]);
      return response.embeddings[0].values;
    } catch (error) {
       throw new CustomError(`Gemini Embedding Error: ${error.message}`, 502, 'AI_API_ERROR');
    }
  }
}

export default new GeminiClient();
