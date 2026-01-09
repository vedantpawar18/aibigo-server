const authService = require('../services/auth.service');
const { logAuditEvent } = require('../utils/auditLogger.util');

/**
 * Register a new student
 */
const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.registerStudent(email, password);
    
    res.status(201).json({
      message: 'Registration successful',
      data: result
    });
  } catch (error) {
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({
      error: error.message,
      message: error.message,
      statusCode
    });
  }
};

/**
 * User login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    
    // Log successful login
    if (result.user && result.user._id) {
      await logAuditEvent({
        userId: result.user._id,
        action: 'LOGIN_SUCCESS',
        ip: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        userAgent: req.headers['user-agent'],
        metadata: {
          email,
          role: result.user.role
        }
      }).catch(err => {
        const logger = require('../config/logger');
        logger.error('Failed to log login success', { error: err.message, stack: err.stack });
      });
    }
    
    res.status(200).json(result);
  } catch (error) {
    // Try to log failed login attempt
    const { email } = req.body;
    if (email) {
      const UserRepository = require('../repositories/User.repository');
      UserRepository.findOne({ email })
        .then(user => {
          if (user) {
            logAuditEvent({
              userId: user._id,
              action: 'LOGIN_FAILURE',
              ip: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
              userAgent: req.headers['user-agent'],
              metadata: {
                email,
                reason: error.message
              }
            }).catch(err => {
              const logger = require('../config/logger');
              logger.error('Failed to log login failure', { error: err.message, stack: err.stack });
            });
          }
        })
        .catch(() => {
          // User not found, skip logging
        });
    }
    
    res.status(error.statusCode || 401).json({
      error: error.message,
      message: error.message
    });
  }
};

/**
 * Request password reset
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    
    res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({
      error: error.message,
      message: error.message,
      statusCode
    });
  }
};

/**
 * Reset password
 */
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const result = await authService.resetPassword(token, newPassword);
    
    res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({
      error: error.message,
      message: error.message,
      statusCode
    });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword
};
