const bcrypt = require('bcrypt');
const UserRepository = require('../repositories/User.repository');
const { generateAccessToken, generateRefreshToken, getPermissionsForRole } = require('../utils/jwt.util');
const logger = require('../config/logger');

/**
 * Register a new student
 */
const registerStudent = async (email, password) => {
  // Validate password
  if (!password || password.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }

  // Check if user already exists
  const existingUser = await UserRepository.findOne({ email });
  if (existingUser) {
    const error = new Error('Email already registered');
    error.statusCode = 409;
    throw error;
  }

  // Hash password
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // Create user with STUDENT role
  const user = await UserRepository.create({
    email,
    passwordHash,
    role: 'STUDENT',
    status: 'ACTIVE',
    linkedEntity: {
      type: 'NONE'
    }
  });

  // Return user without password
  return {
    id: user._id,
    email: user.email,
    role: user.role,
    status: user.status
  };
};

/**
 * User login
 */
const login = async (email, password) => {
  // Find user
  const user = await UserRepository.findOne({ email });
  if (!user) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  // Check status
  if (user.status === 'SUSPENDED' || user.status === 'LOCKED') {
    const error = new Error('Account is suspended or locked');
    error.statusCode = 403;
    throw error;
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isValidPassword) {
    // Increment failed login attempts
    const failedAttempts = (user.failedLoginAttempts || 0) + 1;
    const maxAttempts = 5;

    // Lock account after 5 failed attempts
    if (failedAttempts >= maxAttempts) {
      await UserRepository.updateById(user._id, {
        failedLoginAttempts: failedAttempts,
        status: 'LOCKED',
        lockUntil: new Date(Date.now() + 30 * 60 * 1000) // Lock for 30 minutes
      });

      const error = new Error('Account locked due to too many failed login attempts. Please contact administrator.');
      error.statusCode = 403;
      throw error;
    }

    await UserRepository.updateById(user._id, {
      $inc: { failedLoginAttempts: 1 }
    });

    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  // Reset failed login attempts and update last login
  await UserRepository.updateById(user._id, {
    failedLoginAttempts: 0,
    lastLoginAt: new Date()
  });

  // Get permissions for role
  const permissions = getPermissionsForRole(user.role);

  // Generate JWT tokens
  const accessToken = generateAccessToken({
    userId: user._id,
    role: user.role,
    permissions
  });

  const refreshToken = generateRefreshToken({
    userId: user._id
  });

  // Return response as per Swagger contract (LoginResponse)
  return {
    accessToken,
    refreshToken,
    user: {
      _id: user._id.toString(),
      email: user.email,
      role: user.role,
      status: user.status,
      linkedEntity: {
        type: user.linkedEntity?.type || 'NONE',
        id: user.linkedEntity?.id?.toString() || null
      },
      lastLoginAt: user.lastLoginAt ? user.lastLoginAt.toISOString() : null,
      createdAt: user.createdAt ? user.createdAt.toISOString() : null
    }
  };
};

/**
 * Request password reset
 */
const forgotPassword = async (email) => {
  const user = await UserRepository.findOne({ email });
  
  // Always return success message (security best practice)
  if (user) {
    // Generate reset token (using crypto for secure random token)
    const crypto = require('crypto');
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now
    
    // Save reset token to user
    await UserRepository.updateById(user._id, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetTokenExpiry
    });
    
    // In production, send email with reset token
    // For now, log it (in production, use email service)
    // Log to Winston (will be written to files)
    logger.info('Password reset token generated', {
      email,
      resetToken,
      resetLink: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`,
      expiresAt: resetTokenExpiry
    });
  }
  
  // Return Success schema as per contract
  return {
    message: 'If the email exists, a password reset link has been sent',
    data: {}
  };
};

/**
 * Reset password
 */
const resetPassword = async (token, newPassword) => {
  // Validate password
  if (!newPassword || newPassword.length < 8) {
    const error = new Error('Password must be at least 8 characters long');
    error.statusCode = 400;
    throw error;
  }

  if (!token) {
    const error = new Error('Reset token is required');
    error.statusCode = 400;
    throw error;
  }

  // Find user by reset token
  const user = await UserRepository.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: new Date() } // Token not expired
  });

  if (!user) {
    const error = new Error('Invalid or expired reset token');
    error.statusCode = 400;
    throw error;
  }

  // Hash new password
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(newPassword, saltRounds);

  // Update user password and clear reset token
  await UserRepository.updateById(user._id, {
    passwordHash,
    resetPasswordToken: undefined,
    resetPasswordExpires: undefined,
    failedLoginAttempts: 0, // Reset failed attempts
    status: 'ACTIVE' // Ensure account is active
  });

  // Return Success schema as per contract
  return {
    message: 'Password reset successfully',
    data: {}
  };
};

module.exports = {
  registerStudent,
  login,
  forgotPassword,
  resetPassword
};
