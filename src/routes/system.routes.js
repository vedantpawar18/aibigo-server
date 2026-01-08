const express = require('express');
const router = express.Router();
const systemController = require('../controllers/system.controller');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth.middleware');
const { validateCreateAdminUser } = require('../middleware/validation.middleware');

/**
 * @route   POST /api/v1/system/admin-users
 * @desc    Create admin user
 * @access  Private (PLATFORM_ADMIN)
 */
router.post(
  '/admin-users',
  authenticateJWT,
  authorizeRoles('PLATFORM_ADMIN'),
  validateCreateAdminUser,
  systemController.createAdminUser
);

module.exports = router;
