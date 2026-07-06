import logger from '../../utils/logger.js';

class DecisionEngine {
  /**
   * Determine whether the user's query requires AI processing (generative/analytical)
   * or just simple data retrieval based on heuristics.
   * @param {string} query - The user's input
   * @returns {boolean} - true if AI is required, false otherwise
   */
  requiresAi(query) {
    const text = query.toLowerCase();

    // Keywords that strongly suggest the need for AI generation, analysis, or explanation
    const aiKeywords = [
      'explain', 'improve', 'analyze', 'review', 'tailor', 'generate',
      'create', 'write', 'help', 'why', 'how', 'suggest', 'advise',
      'practice', 'recommend', 'optimize', 'fix', 'evaluate', 'score',
      'rewrite', 'mock'
    ];

    // Keywords that strongly suggest a simple data retrieval request
    const retrievalKeywords = [
      'show', 'list', 'get', 'fetch', 'display', 'find', 'view', 'see'
    ];

    // 1. Check if it explicitly asks for AI operations
    for (const word of aiKeywords) {
      // Using word boundary to avoid matching substrings like "showing" matching "how" (Wait, 'how' is safe but let's be careful)
      const regex = new RegExp(`\\b${word}\\b`, 'i');
      if (regex.test(text)) {
        logger.info(`[DecisionEngine] AI is REQUIRED based on keyword: "${word}"`);
        return true;
      }
    }

    // 2. If it has data retrieval keywords and no AI keywords, no AI is needed
    for (const word of retrievalKeywords) {
      const regex = new RegExp(`\\b${word}\\b`, 'i');
      if (regex.test(text)) {
        logger.info(`[DecisionEngine] AI is NOT required based on retrieval keyword: "${word}"`);
        return false;
      }
    }

    // Default to needing AI if we are unsure, as this is an AI assistant
    logger.info(`[DecisionEngine] AI is REQUIRED by default (no clear retrieval intent)`);
    return true;
  }
}

export const decisionEngine = new DecisionEngine();
