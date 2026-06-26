import winston from 'winston';

const { combine, timestamp, json, printf, colorize } = winston.format;

// Custom format for local development
const devFormat = printf(({ level, message, timestamp, ...meta }) => {
  return `${timestamp} ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    process.env.NODE_ENV === 'production' ? json() : combine(colorize(), devFormat)
  ),
  defaultMeta: { service: 'placementpilot-api' },
  transports: [
    new winston.transports.Console()
  ],
});

// If we wanted to log to a file in production, we could add a File transport here
// if (process.env.NODE_ENV === 'production') {
//   logger.add(new winston.transports.File({ filename: 'error.log', level: 'error' }));
//   logger.add(new winston.transports.File({ filename: 'combined.log' }));
// }

export default logger;
