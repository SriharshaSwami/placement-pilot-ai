import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import morgan from 'morgan';

import errorHandler from './middleware/errorHandler.js';
import notFound from './middleware/notFound.js';
import { successResponse } from './utils/responseFormatter.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import logger from './utils/logger.js';

// Import Routes
import routes from './routes/index.js';

const app = express();

// 1. Initialize Sentry (MUST BE FIRST)
Sentry.init({
  dsn: process.env.SENTRY_DSN || '',
  integrations: [
    nodeProfilingIntegration(),
  ],
  tracesSampleRate: 1.0, 
  profilesSampleRate: 1.0,
});

Sentry.setupExpressErrorHandler(app);

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 4. Rate Limiting (Global API limit)
app.use('/api/', apiLimiter);

// 5. Custom Request Logger
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Logging Middleware
app.use(morgan('dev'));

// Health Check Endpoint
app.get('/health', (req, res) => {
  return successResponse(res, 200, 'Server is healthy', {
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

// API Routes
app.use('/api/v1', routes);

// 404 Handler
app.use(notFound);

// Central Error Handler
app.use(errorHandler);

export default app;
