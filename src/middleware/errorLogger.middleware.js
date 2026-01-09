/**
 * Error Logger Middleware
 * Logs all errors with stack traces and context
 */

const logger = require('../config/logger');

const errorLogger = (err, req, res, next) => {
  const requestId = req.requestId || `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Log error with full context
  logger.error('Request error', {
    requestId,
    error: {
      message: err.message,
      stack: err.stack,
      name: err.name,
      statusCode: err.statusCode || 500,
    },
    request: {
      method: req.method,
      path: req.path,
      url: req.originalUrl || req.url,
      query: req.query,
      body: process.env.NODE_ENV === 'development' ? req.body : undefined, // Only log body in dev
      headers: {
        'user-agent': req.headers['user-agent'],
        'content-type': req.headers['content-type'],
      },
    },
    user: {
      id: req.user?._id || req.user?.id,
      role: req.user?.role,
      email: req.user?.email,
    },
    ip: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
  });

  next(err);
};

module.exports = errorLogger;
