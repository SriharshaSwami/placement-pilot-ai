import { GoogleGenAI } from '@google/genai';

class EmbeddingService {
  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  async generateEmbedding(text) {
    try {
      const response = await this.ai.models.embedContent({
        model: 'text-embedding-004',
        contents: text,
      });
      return response.embeddings[0].values;
    } catch (error) {
      console.error('Embedding Generation Error:', error);
      throw new Error('Failed to generate embedding');
    }
  }

  async generateBatchEmbeddings(texts) {
    // Currently executing sequentially to respect rate limits. 
    // Future: Use batch embed API if available or Promise.all with concurrency limits.
    const embeddings = [];
    for (const text of texts) {
      embeddings.push(await this.generateEmbedding(text));
    }
    return embeddings;
  }
}

export default new EmbeddingService();
