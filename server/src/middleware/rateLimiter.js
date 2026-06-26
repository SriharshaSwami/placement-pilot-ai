import rateLimit from 'express-rate-limit';

// Standard API Rate Limiting (100 req per minute)
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 100,
  standardHeaders: true, 
  legacyHeaders: false, 
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  }
});

// Strict Rate Limiting for heavy AI Tasks (20 req per minute)
export const aiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'AI request limit reached. Please wait a minute before sending more queries.'
  }
});

// Upload Rate Limiting (10 uploads per hour)
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Upload limit reached (10 files/hour). Please try again later.'
  }
});
