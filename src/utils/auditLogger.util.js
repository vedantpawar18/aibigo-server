/**
 * Audit Logger Utility
 * Centralized logging for API actions and user activities
 */

const AuditLogRepository = require('../repositories/AuditLog.repository');
const logger = require('../config/logger');

/**
 * Log an audit event
 * @param {Object} logData - Log data
 * @param {string} logData.userId - User ID
 * @param {string} logData.action - Action type
 * @param {string} logData.ip - IP address
 * @param {string} logData.userAgent - User agent
 * @param {Object} logData.metadata - Additional metadata
 */
const logAuditEvent = async (logData) => {
  try {
    await AuditLogRepository.create({
      userId: logData.userId,
      action: logData.action,
      ip: logData.ip,
      userAgent: logData.userAgent,
      metadata: logData.metadata || {},
      timestamp: new Date()
    });
  } catch (error) {
    // Don't throw - logging should not break the application
    // Log to Winston logger (will be written to files)
    logger.error('Failed to log audit event', {
      error: error.message,
      stack: error.stack,
      logData: logData
    });
  }
};

/**
 * Log API access
 */
const logApiAccess = async (req, action, metadata = {}) => {
  const userId = req.user?._id || req.user?.id;
  if (!userId) return; // Skip logging if no user

  await logAuditEvent({
    userId,
    action: 'API_ACCESS',
    ip: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    userAgent: req.headers['user-agent'],
    metadata: {
      method: req.method,
      path: req.path,
      action,
      ...metadata
    }
  });
};

/**
 * Log data operations
 */
const logDataOperation = async (req, action, entityType, entityId, metadata = {}) => {
  const userId = req.user?._id || req.user?.id;
  if (!userId) return;

  await logAuditEvent({
    userId,
    action,
    ip: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    userAgent: req.headers['user-agent'],
    metadata: {
      entityType,
      entityId,
      ...metadata
    }
  });
};

module.exports = {
  logAuditEvent,
  logApiAccess,
  logDataOperation
};
