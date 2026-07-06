import crypto from 'crypto';
import geminiClient from './gemini.client.js';
import logger from '../../utils/logger.js';

class AiRequestManager {
  constructor() {
    this.modelName = geminiClient.modelName;
    // Cache: { [hash]: { response, timestamp } }
    this.cache = new Map();
    // In-flight Deduplication: { [hash]: Promise }
    this.inFlightRequests = new Map();
  }

  _generateHash(promptText, schema, systemInstruction, model) {
    const data = JSON.stringify({ promptText, schema, systemInstruction, model });
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  async _executeWithRetry(apiCall, maxRetries = 3, baseDelay = 1000) {
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        return await apiCall();
      } catch (error) {
        attempt++;
        // Retry only on 429 or 5xx, or specific network timeouts
        const isRetryable = error.statusCode === 429 || error.statusCode >= 500 || error.code === 'AI_API_ERROR';
        
        if (!isRetryable || attempt >= maxRetries) {
          logger.error(`[AiRequestManager] Request failed permanently after ${attempt} attempts: ${error.message}`);
          throw error;
        }

        const delay = baseDelay * Math.pow(2, attempt - 1);
        logger.warn(`[AiRequestManager] Request failed (Attempt ${attempt}/${maxRetries}). Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  async generateStructuredJSON(promptText, schema, systemInstruction = null, options = {}) {
    const {
      feature = 'general-json',
      useCache = true,
      cacheTTL = 3600, // seconds
      maxRetries = 3
    } = options;

    const requestHash = this._generateHash(promptText, schema, systemInstruction, this.modelName);

    // 1. Check Cache
    if (useCache && this.cache.has(requestHash)) {
      const cachedItem = this.cache.get(requestHash);
      if (Date.now() - cachedItem.timestamp < cacheTTL * 1000) {
        logger.info(`[AiRequestManager] CACHE HIT [${feature}] - Hash: ${requestHash.substring(0, 8)}`);
        return cachedItem.response;
      } else {
        this.cache.delete(requestHash); // Expired
      }
    }

    // 2. Check In-Flight Deduplication
    if (this.inFlightRequests.has(requestHash)) {
      logger.info(`[AiRequestManager] DEDUPLICATION DEDUCT [${feature}] - Awaiting existing promise for hash: ${requestHash.substring(0, 8)}`);
      return this.inFlightRequests.get(requestHash);
    }

    // 3. Execute with Retry
    const startTime = Date.now();
    const requestPromise = this._executeWithRetry(async () => {
      const result = await geminiClient.generateStructuredJSON(promptText, schema, systemInstruction);
      
      const latency = Date.now() - startTime;
      logger.info(`[AiRequestManager] API SUCCESS [${feature}] - Latency: ${latency}ms`);
      
      if (useCache) {
        this.cache.set(requestHash, {
          response: result,
          timestamp: Date.now()
        });
      }
      
      return result;
    }, maxRetries).finally(() => {
      // Remove from in-flight once complete or failed
      this.inFlightRequests.delete(requestHash);
    });

    // Store in in-flight map
    this.inFlightRequests.set(requestHash, requestPromise);

    return requestPromise;
  }

  async generateContent(promptText, systemInstruction = null, model = this.modelName) {
    const requestHash = this._generateHash(promptText, null, systemInstruction, model);
    
    if (this.inFlightRequests.has(requestHash)) {
      return this.inFlightRequests.get(requestHash);
    }

    const requestPromise = this._executeWithRetry(async () => {
      const startTime = Date.now();
      const result = await geminiClient.generateContent(promptText, systemInstruction, model);
      logger.info(`[AiRequestManager] API SUCCESS [text-gen] - Latency: ${Date.now() - startTime}ms`);
      return result;
    }, 3).finally(() => {
      this.inFlightRequests.delete(requestHash);
    });

    this.inFlightRequests.set(requestHash, requestPromise);
    return requestPromise;
  }

  async generateEmbeddings(text) {
    const requestHash = crypto.createHash('sha256').update(text).digest('hex');
    
    if (this.cache.has(requestHash)) {
      return this.cache.get(requestHash).response;
    }

    if (this.inFlightRequests.has(requestHash)) {
      return this.inFlightRequests.get(requestHash);
    }

    const requestPromise = this._executeWithRetry(async () => {
      const startTime = Date.now();
      const result = await geminiClient.generateEmbeddings(text);
      logger.info(`[AiRequestManager] API SUCCESS [embeddings] - Latency: ${Date.now() - startTime}ms`);
      
      this.cache.set(requestHash, { response: result, timestamp: Date.now() });
      return result;
    }, 3).finally(() => {
      this.inFlightRequests.delete(requestHash);
    });

    this.inFlightRequests.set(requestHash, requestPromise);
    return requestPromise;
  }
}

export default new AiRequestManager();
