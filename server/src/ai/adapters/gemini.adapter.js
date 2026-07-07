import crypto from 'crypto';
import geminiClient from './gemini.client.js';
import logger from '../../utils/logger.js';
import AiCache from '../../models/AiCache.js';
import AiLog from '../../models/AiLog.js';

class AiRequestManager {
  constructor() {
    this.modelName = geminiClient.modelName;
    // In-flight Deduplication: { [hash]: Promise }
    this.inFlightRequests = new Map();
  }

  _generateHash(promptText, schema, systemInstruction, model) {
    const data = JSON.stringify({ promptText, schema, systemInstruction, model });
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  // Cost estimates based on Gemini 2.5 Flash pricing (adjust as needed)
  _calculateEstimatedCost(promptTokens, responseTokens) {
    const promptCostPer1k = 0.000075;
    const responseCostPer1k = 0.000300;
    return ((promptTokens / 1000) * promptCostPer1k) + ((responseTokens / 1000) * responseCostPer1k);
  }

  async _logRequest(logData) {
    try {
      await AiLog.create(logData);
    } catch (err) {
      logger.error(`[AiRequestManager] Failed to log AI request: ${err.message}`);
    }
  }

  // Changed default maxRetries to 1 to fail fast unless explicitly overridden
  async _executeWithRetry(apiCall, feature, maxRetries = 1, baseDelay = 1000) {
    let attempt = 0;
    const startTime = Date.now();
    let lastError = null;

    while (attempt < maxRetries) {
      try {
        const result = await apiCall();
        const latency = Date.now() - startTime;
        
        // Extract usage if available
        const usage = result.usageMetadata || { promptTokenCount: 0, candidatesTokenCount: 0, totalTokenCount: 0 };
        
        await this._logRequest({
          featureName: feature,
          model: this.modelName,
          promptTokens: usage.promptTokenCount,
          responseTokens: usage.candidatesTokenCount,
          totalTokens: usage.totalTokenCount,
          latencyMs: latency,
          estimatedCostUSD: this._calculateEstimatedCost(usage.promptTokenCount, usage.candidatesTokenCount),
          cacheHit: false,
          isRetry: attempt > 0,
          success: true
        });

        logger.info(`[AiRequestManager] API SUCCESS [${feature}] - Latency: ${latency}ms, Tokens: ${usage.totalTokenCount}`);
        return result;

      } catch (error) {
        attempt++;
        lastError = error;
        
        // Retry only on 429 or 5xx, or specific network timeouts
        const isRetryable = error.statusCode === 429 || error.statusCode >= 500 || error.code === 'AI_API_ERROR';
        
        if (!isRetryable || attempt >= maxRetries) {
          const latency = Date.now() - startTime;
          await this._logRequest({
            featureName: feature,
            model: this.modelName,
            latencyMs: latency,
            cacheHit: false,
            isRetry: attempt > 1,
            success: false,
            errorMessage: error.message
          });
          logger.error(`[AiRequestManager] Request failed permanently after ${attempt} attempts: ${error.message}`);
          throw error;
        }

        const delay = baseDelay * Math.pow(2, attempt - 1);
        logger.warn(`[AiRequestManager] Request failed (Attempt ${attempt}/${maxRetries}). Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw lastError;
  }

  async generateStructuredJSON(promptText, schema, systemInstruction = null, options = {}) {
    const {
      feature = 'general-json',
      useCache = true,
      cacheTTL = 3600, // seconds
      maxRetries = 1 // Default to 1 (fail fast)
    } = options;

    const requestHash = this._generateHash(promptText, schema, systemInstruction, this.modelName);

    // 1. Check In-Flight Deduplication (Fastest, Memory-based)
    if (this.inFlightRequests.has(requestHash)) {
      logger.info(`[AiRequestManager] DEDUPLICATION [${feature}] - Awaiting existing promise for hash: ${requestHash.substring(0, 8)}`);
      return this.inFlightRequests.get(requestHash);
    }

    // Wrap the entire logic in a promise to store in inFlightRequests
    const requestPromise = (async () => {
      // 2. Check DB Cache
      if (useCache) {
        try {
          const cachedDoc = await AiCache.findOne({ requestHash });
          if (cachedDoc) {
            // Check TTL
            const ageMs = Date.now() - cachedDoc.createdAt.getTime();
            if (ageMs < cacheTTL * 1000) {
              logger.info(`[AiRequestManager] DB CACHE HIT [${feature}] - Hash: ${requestHash.substring(0, 8)}`);
              
              await this._logRequest({
                featureName: feature,
                model: this.modelName,
                latencyMs: 0,
                cacheHit: true,
                success: true
              });
              
              return cachedDoc.responsePayload;
            } else {
              await AiCache.deleteOne({ requestHash });
            }
          }
        } catch (dbErr) {
          logger.error(`[AiRequestManager] Cache lookup failed: ${dbErr.message}`);
        }
      }

      // 3. Execute with Logging & Retry
      const result = await this._executeWithRetry(async () => {
        return await geminiClient.generateStructuredJSON(promptText, schema, systemInstruction);
      }, feature, maxRetries);

      // Save to Cache
      if (useCache) {
        try {
          await AiCache.findOneAndUpdate(
            { requestHash },
            { 
              requestHash, 
              featureName: feature, 
              responsePayload: result 
            },
            { upsert: true, new: true }
          );
        } catch (dbErr) {
          logger.error(`[AiRequestManager] Cache save failed: ${dbErr.message}`);
        }
      }

      return result;
    })();

    this.inFlightRequests.set(requestHash, requestPromise);

    try {
      return await requestPromise;
    } finally {
      this.inFlightRequests.delete(requestHash);
    }
  }

  async generateContent(promptText, systemInstruction = null, model = this.modelName, feature = 'text-gen') {
    const requestHash = this._generateHash(promptText, null, systemInstruction, model);
    
    if (this.inFlightRequests.has(requestHash)) {
      return this.inFlightRequests.get(requestHash);
    }

    const requestPromise = (async () => {
      // Basic text generation doesn't use cache in this app currently, but we log it
      const result = await this._executeWithRetry(async () => {
        return await geminiClient.generateContent(promptText, systemInstruction, model);
      }, feature, 1);
      return result.text;
    })();

    this.inFlightRequests.set(requestHash, requestPromise);
    
    try {
      return await requestPromise;
    } finally {
      this.inFlightRequests.delete(requestHash);
    }
  }

  async generateEmbeddings(text) {
    const requestHash = crypto.createHash('sha256').update(text).digest('hex');
    const feature = 'embeddings';
    
    if (this.inFlightRequests.has(requestHash)) {
      return this.inFlightRequests.get(requestHash);
    }

    const requestPromise = (async () => {
      try {
        const cachedDoc = await AiCache.findOne({ requestHash });
        if (cachedDoc) {
          logger.info(`[AiRequestManager] DB CACHE HIT [embeddings]`);
          return cachedDoc.responsePayload;
        }
      } catch (dbErr) {
         // ignore
      }

      // No retry log wrapper for embeddings since we just want the array, we can manually log or rely on the wrapper
      const startTime = Date.now();
      let result;
      try {
        result = await geminiClient.generateEmbeddings(text);
        
        await this._logRequest({
          featureName: feature,
          model: 'gemini-embedding-2',
          latencyMs: Date.now() - startTime,
          cacheHit: false,
          success: true
        });
      } catch (err) {
        await this._logRequest({
          featureName: feature,
          model: 'gemini-embedding-2',
          latencyMs: Date.now() - startTime,
          cacheHit: false,
          success: false,
          errorMessage: err.message
        });
        throw err;
      }

      try {
        await AiCache.findOneAndUpdate(
          { requestHash },
          { requestHash, featureName: feature, responsePayload: result },
          { upsert: true, new: true }
        );
      } catch (dbErr) {
        // ignore
      }

      return result;
    })();

    this.inFlightRequests.set(requestHash, requestPromise);
    try {
      return await requestPromise;
    } finally {
      this.inFlightRequests.delete(requestHash);
    }
  }
}

export default new AiRequestManager();
