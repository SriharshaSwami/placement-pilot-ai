import crypto from 'crypto';
import logger from '../../utils/logger.js';

class AiCache {
  constructor() {
    // In-memory store. Can easily be swapped with Redis client later.
    this.cache = new Map();
    // Default TTL: 1 hour in milliseconds
    this.defaultTTL = 60 * 60 * 1000;
  }

  /**
   * Generate a deterministic cache key based on the agent name, user query, and actual fetched data content.
   * This ensures that if the user's data (like their resume) changes, the cache key changes,
   * avoiding stale user-specific data being cached.
   */
  generateKey(agentName, query, dataPayload) {
    const dataString = JSON.stringify(dataPayload || {});
    // Hash the combination to create a short, deterministic key
    const hash = crypto.createHash('sha256')
      .update(`${agentName}:${query}:${dataString}`)
      .digest('hex');
    
    return `ai_cache:${hash}`;
  }

  async get(key) {
    const record = this.cache.get(key);
    if (!record) {
      return null;
    }

    // Check TTL
    if (Date.now() > record.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    logger.info(`[AiCache] Cache HIT for key: ${key}`);
    return record.value;
  }

  async set(key, value, ttlMs = this.defaultTTL) {
    const expiresAt = Date.now() + ttlMs;
    this.cache.set(key, { value, expiresAt });
    logger.info(`[AiCache] Cache SET for key: ${key}`);
  }

  // Cleanup expired entries periodically (optional for in-memory)
  cleanup() {
    const now = Date.now();
    for (const [key, record] of this.cache.entries()) {
      if (now > record.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}

export const aiCache = new AiCache();
