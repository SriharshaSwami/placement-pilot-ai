import geminiAdapter from '../ai/adapters/gemini.adapter.js';
import crypto from 'crypto';

class EmbeddingService {
  /**
   * Generates a hash for the input text to track content changes
   */
  generateHash(text) {
    return crypto.createHash('sha256').update(text).digest('hex');
  }

  /**
   * Generates embeddings for the provided text if the hash has changed.
   * @param {string} text The content to embed
   * @param {string} currentHash The existing hash in the DB (optional)
   * @param {Object} context Context for logging
   * @param {string} context.userId The user ID
   * @param {string} context.sourceType e.g., 'Resume', 'Job', 'Interview', 'Search'
   * @param {string} context.sourceId The ID of the source document
   * @returns {Promise<{embedding: number[], hash: string} | null>}
   */
  async generateEmbeddingIfChanged(text, currentHash = null, context = {}) {
    if (!text || text.trim() === '') return null;

    const newHash = this.generateHash(text);
    if (currentHash === newHash) {
      return null; // Content hasn't changed, no need to regenerate
    }

    const startTime = Date.now();
    const embedding = await geminiAdapter.generateEmbeddings(text);
    const durationMs = Date.now() - startTime;

    if (context.userId && context.sourceType) {
      try {
        const EmbeddingLog = (await import('../models/EmbeddingLog.js')).default;
        await EmbeddingLog.create({
          userId: context.userId,
          sourceType: context.sourceType,
          sourceId: context.sourceId || null,
          model: 'gemini-embedding-2',
          contentHash: newHash,
          durationMs
        });
      } catch (err) {
        console.error('Failed to log embedding request:', err);
      }
    }

    return { embedding, hash: newHash };
  }

  /**
   * Calculates Cosine Similarity between two embedding vectors
   * @param {number[]} vecA 
   * @param {number[]} vecB 
   * @returns {number} Score between -1 and 1 (1 being identical)
   */
  calculateSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) return 0;
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}

export default new EmbeddingService();
