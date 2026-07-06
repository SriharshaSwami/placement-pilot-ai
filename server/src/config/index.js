import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  db: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/placementpilot',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m', // Short-lived access token
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d', // Long-lived refresh token
  },
  rateLimit: {
    api: {
      windowMs: parseInt(process.env.RATE_LIMIT_API_WINDOW || '60000', 10), // 1 minute
      max: parseInt(process.env.RATE_LIMIT_API_MAX || '100', 10),
    },
    ai: {
      windowMs: parseInt(process.env.RATE_LIMIT_AI_WINDOW || '60000', 10), // 1 minute
      max: parseInt(process.env.RATE_LIMIT_AI_MAX || '20', 10),
    },
    upload: {
      windowMs: parseInt(process.env.RATE_LIMIT_UPLOAD_WINDOW || '3600000', 10), // 1 hour
      max: parseInt(process.env.RATE_LIMIT_UPLOAD_MAX || '10', 10),
    },
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
  },
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  }
};

export default config;
