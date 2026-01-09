# Comprehensive Logging System for Deployment

## Overview
A production-ready logging system using Winston with file rotation, structured logging, and API endpoints for log retrieval.

## Features

### 1. **Winston Logger Configuration**
- **Location**: `src/config/logger.js`
- **Features**:
  - Console logging (development: colored, production: JSON)
  - File logging with daily rotation
  - Separate files for combined logs, errors, and API requests
  - Automatic log retention (14 days for general logs, 30 days for errors)
  - Exception and rejection handlers
  - Configurable log levels

### 2. **Log Files Structure**
Logs are stored in the `logs/` directory:
- `combined-YYYY-MM-DD.log` - All logs (info level and above)
- `error-YYYY-MM-DD.log` - Error logs only
- `api-YYYY-MM-DD.log` - API request logs
- `exceptions.log` - Uncaught exceptions
- `rejections.log` - Unhandled promise rejections

### 3. **Request Logging Middleware**
- **Location**: `src/middleware/requestLogger.middleware.js`
- **Features**:
  - Logs all incoming requests with request ID
  - Tracks request duration
  - Includes IP, user agent, user info
  - Logs response status and duration

### 4. **Error Logging Middleware**
- **Location**: `src/middleware/errorLogger.middleware.js`
- **Features**:
  - Logs all errors with full stack traces
  - Includes request context
  - User information
  - Request details

## API Endpoints for Log Retrieval

All log endpoints require `PLATFORM_ADMIN` role and JWT authentication.

### 1. Get List of Log Files
```
GET /api/v1/platform-admin/system/logs/files
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "filename": "combined-2024-01-15.log",
      "size": 1024000,
      "created": "2024-01-15T00:00:00.000Z",
      "modified": "2024-01-15T23:59:59.000Z"
    }
  ]
}
```

### 2. Get Recent Logs
```
GET /api/v1/platform-admin/system/logs/recent?lines=50&level=error&search=login
```

**Query Parameters:**
- `lines` (optional, default: 50) - Number of log lines to retrieve
- `level` (optional) - Filter by log level: `error`, `warn`, `info`, `debug`
- `search` (optional) - Search term to filter logs

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 50,
    "logs": [
      {
        "file": "combined-2024-01-15.log",
        "log": "{\"timestamp\":\"2024-01-15 10:30:00\",\"level\":\"error\",\"message\":\"Database connection failed\"}"
      }
    ]
  }
}
```

### 3. Get Log Statistics
```
GET /api/v1/platform-admin/system/logs/statistics
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalFiles": 5,
    "totalSize": 5242880,
    "files": [
      {
        "name": "combined-2024-01-15.log",
        "size": 1024000,
        "modified": "2024-01-15T23:59:59.000Z"
      }
    ],
    "levels": {
      "error": 15,
      "warn": 42,
      "info": 1234,
      "debug": 567
    }
  }
}
```

### 4. Read Specific Log File
```
GET /api/v1/platform-admin/system/logs/files/{filename}?lines=100&level=error&search=login
```

**Path Parameters:**
- `filename` - Name of the log file (e.g., `combined-2024-01-15.log`)

**Query Parameters:**
- `lines` (optional, default: 100) - Number of lines from end of file
- `level` (optional) - Filter by log level
- `search` (optional) - Search term

**Response:**
```json
{
  "success": true,
  "data": {
    "filename": "combined-2024-01-15.log",
    "totalLines": 5000,
    "returnedLines": 100,
    "lines": [
      "{\"timestamp\":\"2024-01-15 10:30:00\",\"level\":\"error\",\"message\":\"Error message\"}"
    ]
  }
}
```

## Usage Examples

### Using Logger in Code

```javascript
const logger = require('./config/logger');

// Different log levels
logger.error('Error message', { error: err, userId: user.id });
logger.warn('Warning message', { data: someData });
logger.info('Info message', { action: 'user_login', userId: user.id });
logger.debug('Debug message', { request: req.body });

// Log with context
logger.info('User action', {
  userId: user.id,
  action: 'data_created',
  entityType: 'University',
  entityId: university._id,
});
```

### Environment Variables

```bash
# Log level (error, warn, info, debug)
LOG_LEVEL=info

# Enable file logging (even in development)
LOG_TO_FILE=true

# Node environment
NODE_ENV=production
```

## Log Levels

- **error**: Errors that need immediate attention
- **warn**: Warnings about potential issues
- **info**: General informational messages
- **debug**: Detailed debugging information (development only)

## Integration Points

### 1. Server Startup
- Database connection logs
- Server initialization logs
- Environment information

### 2. HTTP Requests
- All incoming requests logged with request ID
- Response status and duration
- User information (if authenticated)

### 3. Errors
- All errors logged with stack traces
- Request context included
- User information

### 4. Database Operations
- Connection events
- Errors and disconnections
- Reconnection events

### 5. Audit Logs
- User actions
- API access
- Data operations

## Deployment Considerations

### Vercel/Serverless
- Logs are written to `/tmp` directory in serverless environments
- Consider using external logging services (e.g., LogDNA, Datadog) for production
- Winston can be configured to send logs to external services

### File System
- Logs directory is automatically created
- Logs are excluded from git (`.gitignore`)
- Daily rotation prevents disk space issues
- Automatic cleanup of old logs

### Security
- Log endpoints require `PLATFORM_ADMIN` role
- Sensitive data should not be logged
- Request bodies are only logged in development mode

## Monitoring and Alerts

### Recommended Setup
1. **Error Monitoring**: Set up alerts for error-level logs
2. **Performance Monitoring**: Track request durations
3. **Log Aggregation**: Use services like:
   - LogDNA
   - Datadog
   - CloudWatch (AWS)
   - Google Cloud Logging

### Log Analysis
- Use the statistics endpoint to monitor log growth
- Filter by level to identify issues
- Search functionality helps find specific events

## Best Practices

1. **Log Levels**: Use appropriate log levels
   - `error`: Only for actual errors
   - `warn`: For potential issues
   - `info`: For important events
   - `debug`: For detailed debugging

2. **Structured Logging**: Always include context
   ```javascript
   logger.info('User logged in', {
     userId: user.id,
     email: user.email,
     ip: req.ip,
   });
   ```

3. **Don't Log Sensitive Data**: Never log passwords, tokens, or PII

4. **Performance**: Logging is asynchronous, but avoid excessive logging in hot paths

5. **Error Context**: Always include error context
   ```javascript
   logger.error('Database error', {
     error: err.message,
     stack: err.stack,
     query: queryString,
   });
   ```

## Troubleshooting

### Logs Not Appearing
1. Check `LOG_LEVEL` environment variable
2. Verify `logs/` directory exists and is writable
3. Check file permissions

### Large Log Files
1. Adjust `maxSize` in logger configuration
2. Reduce log retention period
3. Use log rotation more frequently

### Missing Logs in Production
1. Ensure `LOG_TO_FILE=true` or `NODE_ENV=production`
2. Check disk space
3. Verify write permissions

## Next Steps

1. **External Logging Service**: Integrate with LogDNA, Datadog, or similar
2. **Log Aggregation**: Set up centralized log collection
3. **Alerting**: Configure alerts for critical errors
4. **Log Analysis**: Set up dashboards for log visualization
5. **Performance Metrics**: Track and analyze request durations
