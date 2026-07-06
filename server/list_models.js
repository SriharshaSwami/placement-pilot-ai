import { GoogleGenAI } from '@google/genai';
import config from './src/config/index.js';

const ai = new GoogleGenAI({ apiKey: config.gemini.apiKey });

async function listModels() {
  try {
    const response = await ai.models.list();
    console.log(JSON.stringify(response, null, 2));
  } catch (error) {
    console.error("Error listing models:", error);
  }
}

listModels();
