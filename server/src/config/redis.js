import Redis from 'ioredis';
import logger from '../utils/logger.js';

let redisClient = null;

if (process.env.REDIS_URL) {
  redisClient = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    }
  });

  redisClient.on('connect', () => {
    logger.info('Connected to Redis successfully.');
  });

  redisClient.on('error', (err) => {
    logger.error('Redis Connection Error:', err);
  });
} else {
  logger.warn('REDIS_URL not provided. Redis caching and BullMQ will be disabled. Proceeding with in-memory fallbacks where possible.');
}

export default redisClient;
