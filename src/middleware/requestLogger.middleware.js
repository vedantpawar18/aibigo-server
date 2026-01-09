/**
 * Request Logger Middleware
 * Logs all HTTP requests with detailed information
 */

const logger = require('../config/logger');

const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  const requestId = req.headers['x-request-id'] || `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Attach request ID to request object for tracking
  req.requestId = requestId;

  // Log request
  logger.info('Incoming request', {
    requestId,
    method: req.method,
    path: req.path,
    url: req.originalUrl || req.url,
    ip: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    userAgent: req.headers['user-agent'],
    contentType: req.headers['content-type'],
    contentLength: req.headers['content-length'],
    query: req.query,
    userId: req.user?._id || req.user?.id,
    role: req.user?.role,
  });

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logLevel = res.statusCode >= 400 ? 'warn' : 'info';
    
    logger[logLevel]('Request completed', {
      requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      userId: req.user?._id || req.user?.id,
      contentLength: res.get('content-length'),
    });
  });

  next();
};

module.exports = requestLogger;
