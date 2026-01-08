const authService = require('../services/auth.service');

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
    
    res.status(200).json(result);
  } catch (error) {
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
