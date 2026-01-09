/**
 * Log Routes
 * Routes for log retrieval and management
 */

const express = require('express');
const router = express.Router();
const logController = require('../controllers/log.controller');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth.middleware');

// All log routes require PLATFORM_ADMIN role
router.use(authenticateJWT);
router.use(authorizeRoles('PLATFORM_ADMIN'));

/**
 * @route   GET /api/v1/platform-admin/system/logs/files
 * @desc    Get list of log files
 * @access  Private (PLATFORM_ADMIN)
 */
router.get('/files', logController.getLogFiles);

/**
 * @route   GET /api/v1/platform-admin/system/logs/recent
 * @desc    Get recent logs from all files
 * @access  Private (PLATFORM_ADMIN)
 */
router.get('/recent', logController.getRecentLogs);

/**
 * @route   GET /api/v1/platform-admin/system/logs/statistics
 * @desc    Get log statistics
 * @access  Private (PLATFORM_ADMIN)
 */
router.get('/statistics', logController.getLogStatistics);

/**
 * @route   GET /api/v1/platform-admin/system/logs/files/:filename
 * @desc    Read specific log file
 * @access  Private (PLATFORM_ADMIN)
 */
router.get('/files/:filename', logController.readLogFile);

/**
 * @route   GET /api/v1/platform-admin/system/logs/download/:filename
 * @desc    Download specific log file
 * @access  Private (PLATFORM_ADMIN)
 */
router.get('/download/:filename', logController.downloadLogFile);

/**
 * @route   GET /api/v1/platform-admin/system/logs/download
 * @desc    Download today's log file
 * @access  Private (PLATFORM_ADMIN)
 */
router.get('/download', logController.downloadTodayLog);

module.exports = router;
