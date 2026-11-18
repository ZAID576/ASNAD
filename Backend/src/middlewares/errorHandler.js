import { errorResponse } from '../utils/response.js';
import { logger } from '../utils/logger.js';
import { ENV } from '../config/env.js';

export const errorHandler = (err, req, res, next) => {
  logger.error(`Unhandled Exception at ${req.method} ${req.originalUrl}`, err);

  const statusCode = err.statusCode || 500;
  const message = err.isOperational || ENV.NODE_ENV !== 'production'
    ? err.message
    : 'An unexpected internal error occurred. Please try again.';

  const code = err.code || 'INTERNAL_SERVER_ERROR';
  const details = ENV.NODE_ENV === 'development' ? err.stack : undefined;

  return errorResponse(res, message, code, statusCode, details);
};
