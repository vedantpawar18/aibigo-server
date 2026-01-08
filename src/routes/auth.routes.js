const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword
} = require('../middleware/validation.middleware');

/**
 * @route   POST /api/v1/auth/register
 * @desc    Student self-registration
 * @access  Public
 */
router.post('/register', validateRegister, authController.register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    User login
 * @access  Public
 */
router.post('/login', validateLogin, authController.login);

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
router.post('/forgot-password', validateForgotPassword, authController.forgotPassword);

/**
 * @route   POST /api/v1/auth/reset-password
 * @desc    Reset password
 * @access  Public
 */
router.post('/reset-password', validateResetPassword, authController.resetPassword);

module.exports = router;
