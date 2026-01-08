const jwt = require('jsonwebtoken');

/**
 * Generate JWT access token
 * @param {Object} payload - Token payload (userId, role, permissions)
 * @returns {string} JWT token
 */
const generateAccessToken = (payload) => {
  const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
  const expiresIn = process.env.JWT_EXPIRY || '24h';

  const tokenPayload = {
    sub: payload.userId || payload.id,
    role: payload.role,
    permissions: payload.permissions || [],
    iat: Math.floor(Date.now() / 1000)
  };

  return jwt.sign(tokenPayload, secret, { expiresIn });
};

/**
 * Generate JWT refresh token (optional)
 * @param {Object} payload - Token payload
 * @returns {string} Refresh token
 */
const generateRefreshToken = (payload) => {
  const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'your-refresh-secret-key';
  const expiresIn = process.env.JWT_REFRESH_EXPIRY || '7d';

  const tokenPayload = {
    sub: payload.userId || payload.id,
    type: 'refresh'
  };

  return jwt.sign(tokenPayload, secret, { expiresIn });
};

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
  return jwt.verify(token, secret);
};

/**
 * Get permissions for a role
 * @param {string} role - User role
 * @returns {Array} Array of permissions
 */
const getPermissionsForRole = (role) => {
  const permissionsMap = {
    PLATFORM_ADMIN: ['*'], // All permissions (platform-level admin)
    OPERATIONS_ADMIN: [
      'INSTITUTES:READ',
      'INSTITUTES:WRITE',
      'FACULTY:READ',
      'FACULTY:WRITE',
      'STUDENTS:READ',
      'STUDENTS:WRITE'
    ],
    FACULTY: [
      'SYLLABUS:READ',
      'AI:GENERATE',
      'CONTENT:WRITE'
    ],
    STUDENT: [
      'LEARNING:READ',
      'ASSESSMENTS:ATTEMPT',
      'JOBS:APPLY'
    ]
  };

  return permissionsMap[role] || [];
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  getPermissionsForRole
};
