/**
 * Log Controller
 * Handles log retrieval endpoints
 */

const logService = require('../services/log.service');
const logger = require('../config/logger');

/**
 * Get list of log files
 */
const getLogFiles = async (req, res) => {
  try {
    const files = await logService.getLogFiles();
    res.status(200).json({
      success: true,
      data: files,
    });
  } catch (error) {
    logger.error('Error getting log files', { error: error.message });
    res.status(500).json({
      error: error.message,
      message: 'Failed to retrieve log files',
    });
  }
};

/**
 * Read specific log file
 */
const readLogFile = async (req, res) => {
  try {
    const { filename } = req.params;
    const { lines = 100, level = null, search = null } = req.query;

    const result = await logService.readLogFile(filename, {
      lines: parseInt(lines),
      level,
      search,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error('Error reading log file', { error: error.message, filename: req.params.filename });
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      error: error.message,
      message: 'Failed to read log file',
    });
  }
};

/**
 * Get recent logs from all files
 */
const getRecentLogs = async (req, res) => {
  try {
    const { lines = 50, level = null, search = null } = req.query;

    const result = await logService.getRecentLogs({
      lines: parseInt(lines),
      level,
      search,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error('Error getting recent logs', { error: error.message });
    res.status(500).json({
      error: error.message,
      message: 'Failed to retrieve recent logs',
    });
  }
};

/**
 * Get log statistics
 */
const getLogStatistics = async (req, res) => {
  try {
    const stats = await logService.getLogStatistics();
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    logger.error('Error getting log statistics', { error: error.message });
    res.status(500).json({
      error: error.message,
      message: 'Failed to retrieve log statistics',
    });
  }
};

/**
 * Download log file
 * Streams the file directly for download
 */
const downloadLogFile = async (req, res) => {
  try {
    const { filename } = req.params;
    
    // If no filename provided, download today's log file
    const logFilename = filename || logService.getTodayLogFileName();
    
    const fileData = await logService.downloadLogFile(logFilename);

    // Set headers for file download
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="${logFilename}"`);
    res.setHeader('Content-Length', fileData.size);
    res.setHeader('Cache-Control', 'no-cache');

    // Stream the file
    fileData.stream.pipe(res);

    // Handle stream errors
    fileData.stream.on('error', (error) => {
      logger.error('Error streaming log file', { error: error.message, filename: logFilename });
      if (!res.headersSent) {
        res.status(500).json({
          error: 'Failed to stream log file',
          message: error.message,
        });
      }
    });
  } catch (error) {
    logger.error('Error downloading log file', { error: error.message, filename: req.params.filename });
    const statusCode = error.message.includes('not found') ? 404 : 500;
    if (!res.headersSent) {
      res.status(statusCode).json({
        error: error.message,
        message: 'Failed to download log file',
      });
    }
  }
};

/**
 * Download today's log file
 */
const downloadTodayLog = async (req, res) => {
  try {
    const todayFilename = logService.getTodayLogFileName();
    const fileData = await logService.downloadLogFile(todayFilename);

    // Set headers for file download
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="${todayFilename}"`);
    res.setHeader('Content-Length', fileData.size);
    res.setHeader('Cache-Control', 'no-cache');

    // Stream the file
    fileData.stream.pipe(res);

    // Handle stream errors
    fileData.stream.on('error', (error) => {
      logger.error('Error streaming today\'s log file', { error: error.message });
      if (!res.headersSent) {
        res.status(500).json({
          error: 'Failed to stream log file',
          message: error.message,
        });
      }
    });
  } catch (error) {
    logger.error('Error downloading today\'s log file', { error: error.message });
    const statusCode = error.message.includes('not found') ? 404 : 500;
    if (!res.headersSent) {
      res.status(statusCode).json({
        error: error.message,
        message: 'Failed to download today\'s log file',
      });
    }
  }
};

module.exports = {
  getLogFiles,
  readLogFile,
  getRecentLogs,
  getLogStatistics,
  downloadLogFile,
  downloadTodayLog,
};
