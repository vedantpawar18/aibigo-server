/**
 * Winston Logger Configuration
 * Comprehensive logging system for deployment and production monitoring
 */

const winston = require('winston');
require('winston-daily-rotate-file');
const path = require('path');
const fs = require('fs');

// Create logs directory if it doesn't exist
// For Vercel/serverless: use /tmp directory (only writable location)
// For local: use logs directory in project root
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_URL;
const logsDir = isVercel 
  ? path.join('/tmp', 'logs')
  : path.join(__dirname, '../../logs');

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...metadata }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(metadata).length > 0) {
      msg += ` ${JSON.stringify(metadata)}`;
    }
    return msg;
  })
);

// Define transports
const transports = [];

// Console transport (always enabled)
transports.push(
  new winston.transports.Console({
    format: process.env.NODE_ENV === 'production' ? logFormat : consoleFormat,
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  })
);

// File transports (ALWAYS enabled - logs should be stored in every case)
// SINGLE combined log file per day (all logs - info, error, warn, debug)
transports.push(
  new winston.transports.DailyRotateFile({
    filename: path.join(logsDir, 'combined-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '50m', // Increased size for single file
    maxFiles: '30d', // Keep logs for 30 days
    format: logFormat,
    level: 'debug', // Log all levels (debug, info, warn, error)
    handleExceptions: true,
    handleRejections: true,
    zippedArchive: false, // Don't zip for easier download
  })
);

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  format: logFormat,
  defaultMeta: {
    service: 'aibigo-server',
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
  },
  transports,
  // Handle exceptions and rejections - Write to combined log file
  exceptionHandlers: [
    new winston.transports.Console({
      format: consoleFormat,
    }),
    new winston.transports.DailyRotateFile({
      filename: path.join(logsDir, 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '50m',
      maxFiles: '30d',
      format: logFormat,
      level: 'error',
    }),
  ],
  rejectionHandlers: [
    new winston.transports.Console({
      format: consoleFormat,
    }),
    new winston.transports.DailyRotateFile({
      filename: path.join(logsDir, 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '50m',
      maxFiles: '30d',
      format: logFormat,
      level: 'error',
    }),
  ],
  // Exit on error to ensure logs are written
  exitOnError: false,
});

// Create a stream for Morgan HTTP request logging
logger.stream = {
  write: (message) => {
    // Always log HTTP requests to both console and file
    logger.info(message.trim(), { source: 'http' });
  },
};

// Ensure logger is ready and can write to files
logger.on('error', (error) => {
  console.error('Logger error:', error);
  // Try to write to a fallback file if logger fails
  try {
    fs.appendFileSync(
      path.join(logsDir, 'logger-errors.log'),
      `${new Date().toISOString()} - Logger Error: ${error.message}\n${error.stack}\n\n`
    );
  } catch (err) {
    console.error('Failed to write logger error to file:', err);
  }
});

// Verify logs directory is writable
try {
  const testFile = path.join(logsDir, '.writable-test');
  fs.writeFileSync(testFile, 'test');
  fs.unlinkSync(testFile);
} catch (error) {
  console.error('Logs directory is not writable:', error);
  console.error('Logs directory path:', logsDir);
}

// Log initialization (this will be written to files)
logger.info('Logger initialized', {
  logsDirectory: logsDir,
  environment: process.env.NODE_ENV || 'development',
  fileLogging: 'enabled',
  transports: transports.length,
  logLevel: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  isVercel: isVercel,
  logFile: 'combined-YYYY-MM-DD.log (single file per day)',
});

// Export logs directory path for use in log service
logger.logsDir = logsDir;

module.exports = logger;
