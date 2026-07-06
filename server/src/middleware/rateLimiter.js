import rateLimit from 'express-rate-limit';
import config from '../config/index.js';

// Standard API Rate Limiting
export const apiLimiter = rateLimit({
  windowMs: config.rateLimit.api.windowMs, 
  max: config.rateLimit.api.max,
  standardHeaders: true, 
  legacyHeaders: false, 
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  }
});

// Strict Rate Limiting for heavy AI Tasks
export const aiLimiter = rateLimit({
  windowMs: config.rateLimit.ai.windowMs,
  max: config.rateLimit.ai.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'AI request limit reached. Please wait a minute before sending more queries.'
  }
});

// Upload Rate Limiting
export const uploadLimiter = rateLimit({
  windowMs: config.rateLimit.upload.windowMs,
  max: config.rateLimit.upload.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Upload limit reached. Please try again later.'
  }
});
