/**
 * Log Service
 * Service for retrieving and managing application logs
 */

const fs = require('fs');
const path = require('path');
const logger = require('../config/logger');

// Use the same logs directory as logger (handles Vercel /tmp)
const logsDir = logger.logsDir || path.join(__dirname, '../../logs');

/**
 * Get log files list (only combined log files)
 */
const getLogFiles = async () => {
  try {
    if (!fs.existsSync(logsDir)) {
      return [];
    }

    const files = fs.readdirSync(logsDir);
    // Only return combined log files (one per day)
    return files
      .filter(file => file.startsWith('combined-') && file.endsWith('.log'))
      .map(file => {
        const filePath = path.join(logsDir, file);
        const stats = fs.statSync(filePath);
        return {
          filename: file,
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime,
        };
      })
      .sort((a, b) => b.modified - a.modified);
  } catch (error) {
    logger.error('Error reading log files', { error: error.message });
    throw error;
  }
};

/**
 * Get today's log file name
 */
const getTodayLogFileName = () => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return `combined-${today}.log`;
};

/**
 * Download log file (streams file for download)
 */
const downloadLogFile = async (filename) => {
  try {
    const filePath = path.join(logsDir, filename);

    // Security: prevent directory traversal
    if (!filePath.startsWith(logsDir)) {
      throw new Error('Invalid log file path');
    }

    // Only allow combined log files
    if (!filename.startsWith('combined-') || !filename.endsWith('.log')) {
      throw new Error('Invalid log file. Only combined log files are allowed.');
    }

    if (!fs.existsSync(filePath)) {
      throw new Error('Log file not found');
    }

    const stats = fs.statSync(filePath);
    
    return {
      filePath,
      filename,
      size: stats.size,
      stream: fs.createReadStream(filePath),
    };
  } catch (error) {
    logger.error('Error preparing log file download', { error: error.message, filename });
    throw error;
  }
};

/**
 * Read log file content (only combined log files)
 */
const readLogFile = async (filename, options = {}) => {
  try {
    const { lines = 100, level = null, search = null } = options;
    
    // Only allow combined log files
    if (!filename.startsWith('combined-') || !filename.endsWith('.log')) {
      throw new Error('Invalid log file. Only combined log files are allowed.');
    }
    
    const filePath = path.join(logsDir, filename);

    // Security: prevent directory traversal
    if (!filePath.startsWith(logsDir)) {
      throw new Error('Invalid log file path');
    }

    if (!fs.existsSync(filePath)) {
      throw new Error('Log file not found');
    }

    const content = fs.readFileSync(filePath, 'utf8');
    let logLines = content.split('\n').filter(line => line.trim());

    // Filter by log level if specified
    if (level) {
      logLines = logLines.filter(line => {
        try {
          const logEntry = JSON.parse(line);
          return logEntry.level === level.toUpperCase();
        } catch {
          return line.toLowerCase().includes(level.toLowerCase());
        }
      });
    }

    // Search filter
    if (search) {
      logLines = logLines.filter(line =>
        line.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Get last N lines
    const result = logLines.slice(-lines);

    return {
      filename,
      totalLines: logLines.length,
      returnedLines: result.length,
      lines: result,
    };
  } catch (error) {
    logger.error('Error reading log file', { error: error.message, filename });
    throw error;
  }
};

/**
 * Get recent logs from all files
 */
const getRecentLogs = async (options = {}) => {
  try {
    const { lines = 50, level = null, search = null } = options;
    const logFiles = await getLogFiles();
    const allLogs = [];

    // Read from most recent files first
    for (const file of logFiles.slice(0, 5)) {
      try {
        const fileLogs = await readLogFile(file.filename, { lines: 20, level, search });
        allLogs.push(...fileLogs.lines.map(line => ({
          file: file.filename,
          log: line,
        })));
      } catch (error) {
        // Skip files that can't be read
        continue;
      }
    }

    // Sort by timestamp (if available) and return last N lines
    const sortedLogs = allLogs
      .sort((a, b) => {
        try {
          const aTime = JSON.parse(a.log).timestamp || '';
          const bTime = JSON.parse(b.log).timestamp || '';
          return bTime.localeCompare(aTime);
        } catch {
          return 0;
        }
      })
      .slice(-lines);

    return {
      total: sortedLogs.length,
      logs: sortedLogs,
    };
  } catch (error) {
    logger.error('Error getting recent logs', { error: error.message });
    throw error;
  }
};

/**
 * Get log statistics (only for combined log files)
 */
const getLogStatistics = async () => {
  try {
    const logFiles = await getLogFiles(); // Only combined log files
    const stats = {
      totalFiles: logFiles.length,
      totalSize: 0,
      files: [],
      levels: {
        error: 0,
        warn: 0,
        info: 0,
        debug: 0,
      },
    };

    for (const file of logFiles) {
      stats.totalSize += file.size;
      stats.files.push({
        name: file.filename,
        size: file.size,
        modified: file.modified,
      });

      // Try to count log levels in file
      try {
        const content = fs.readFileSync(path.join(logsDir, file.filename), 'utf8');
        const lines = content.split('\n').filter(line => line.trim());
        lines.forEach(line => {
          try {
            const logEntry = JSON.parse(line);
            const level = logEntry.level?.toLowerCase();
            if (stats.levels.hasOwnProperty(level)) {
              stats.levels[level]++;
            }
          } catch {
            // Not JSON, try string matching
            if (line.toLowerCase().includes('error')) stats.levels.error++;
            else if (line.toLowerCase().includes('warn')) stats.levels.warn++;
            else if (line.toLowerCase().includes('info')) stats.levels.info++;
            else if (line.toLowerCase().includes('debug')) stats.levels.debug++;
          }
        });
      } catch {
        // Skip if file can't be read
      }
    }

    return stats;
  } catch (error) {
    logger.error('Error getting log statistics', { error: error.message });
    throw error;
  }
};

module.exports = {
  getLogFiles,
  readLogFile,
  getRecentLogs,
  getLogStatistics,
  downloadLogFile,
  getTodayLogFileName,
};
