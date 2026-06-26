import logger from '../logger/index.js';
import config from '../config/index.js';
import { errorResponse } from '../utils/responseFormatter.js';

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errorCode = err.errorCode || 'SERVER_ERROR';
  let details = err.details || {};

  // Log the error
  if (statusCode === 500) {
    logger.error(`[500] ${err.stack}`);
  } else {
    logger.warn(`[${statusCode}] ${message}`);
  }

  // Mongoose Bad ObjectId
  if (err.name === 'CastError') {
    message = 'Resource not found';
    statusCode = 404;
    errorCode = 'RESOURCE_NOT_FOUND';
  }

  // Mongoose Duplicate Key
  if (err.code === 11000) {
    message = 'Duplicate field value entered';
    statusCode = 400;
    errorCode = 'DUPLICATE_FIELD';
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors).map((val) => val.message).join(', ');
    statusCode = 400;
    errorCode = 'VALIDATION_ERROR';
  }

  const errorOutput = config.env === 'development' ? err.stack : undefined;

  return errorResponse(res, statusCode, message, errorCode, details);
};

export default errorHandler;
