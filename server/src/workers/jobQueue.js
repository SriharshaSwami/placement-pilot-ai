import { Queue, Worker } from 'bullmq';
import redisClient from '../config/redis.js';
import logger from '../utils/logger.js';

let aiQueue = null;

if (redisClient) {
  aiQueue = new Queue('ai-tasks', { connection: redisClient });

  const aiWorker = new Worker('ai-tasks', async job => {
    logger.info(`Processing job ${job.id} of type ${job.name}`);
    // Simulated background task (e.g. generating embeddings for a huge resume)
    if (job.name === 'generate_embeddings') {
      // simulate long work
      await new Promise(resolve => setTimeout(resolve, 5000));
      logger.info(`Job ${job.id} completed.`);
      return { success: true };
    }
  }, { connection: redisClient });

  aiWorker.on('completed', job => {
    logger.info(`Worker completed job ${job.id}`);
  });

  aiWorker.on('failed', (job, err) => {
    logger.error(`Worker failed job ${job.id}: ${err.message}`);
  });
} else {
  logger.warn('Redis is not connected. BullMQ background jobs are disabled. Tasks will be executed synchronously.');
}

export const enqueueAiTask = async (name, data) => {
  if (aiQueue) {
    return aiQueue.add(name, data, { attempts: 3, backoff: { type: 'exponential', delay: 1000 } });
  } else {
    // Fallback if no redis
    logger.info(`Simulating synchronous execution for ${name}`);
    return null;
  }
};
