/**
 * Audit Log Middleware
 * Automatically logs API access for authenticated routes
 */

const { logApiAccess } = require('../utils/auditLogger.util');

/**
 * Middleware to log API access
 * Should be used after authentication middleware
 */
const auditLogMiddleware = async (req, res, next) => {
  // Log the API access asynchronously (don't block the request)
  logApiAccess(req, 'API_ACCESS').catch(err => {
    console.error('Failed to log API access:', err);
  });
  
  next();
};

module.exports = auditLogMiddleware;
