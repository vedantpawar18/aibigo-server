# Logger Single File Per Day + Download API

## Overview
The logger now creates **only one combined log file per day** and provides API endpoints to download these files. The system works seamlessly on both local development and Vercel serverless deployments.

## Changes Made

### 1. **Single Combined Log File Per Day**
- **Before**: Multiple log files (combined, error, api, exceptions, rejections)
- **After**: Single `combined-YYYY-MM-DD.log` file per day containing all logs (debug, info, warn, error)

**Location**: `src/config/logger.js`

**Changes**:
- Removed separate error, api, exceptions, and rejections log files
- Single `DailyRotateFile` transport for all logs
- Log level set to `debug` to capture all log levels
- Max file size increased to 50MB (since it's the only file)
- Exceptions and rejections also write to the combined file

### 2. **Vercel/Serverless Support**
- **Logs Directory**: Automatically detects Vercel environment
  - **Vercel**: Uses `/tmp/logs` (only writable location in serverless)
  - **Local**: Uses `logs/` directory in project root

**Implementation**:
```javascript
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_URL;
const logsDir = isVercel 
  ? path.join('/tmp', 'logs')
  : path.join(__dirname, '../../logs');
```

### 3. **Download API Endpoints**

#### **Download Today's Log File**
```
GET /api/v1/platform-admin/system/logs/download
```
- Downloads today's combined log file
- No filename required
- Returns file as download with proper headers

#### **Download Specific Log File**
```
GET /api/v1/platform-admin/system/logs/download/:filename
```
- Downloads a specific combined log file by date
- Example: `/download/combined-2024-01-15.log`
- Only allows `combined-*.log` files (security)

**Location**: `src/routes/log.routes.js`, `src/controllers/log.controller.js`

### 4. **Security Enhancements**
- Only allows `combined-*.log` files (prevents directory traversal)
- Validates filename format before processing
- All endpoints require `PLATFORM_ADMIN` role authentication

### 5. **Updated Log Service**
- `getLogFiles()` - Only returns combined log files
- `readLogFile()` - Only allows reading combined log files
- `downloadLogFile()` - Streams file for download
- `getTodayLogFileName()` - Helper to get today's filename

**Location**: `src/services/log.service.js`

## API Usage

### Download Today's Log File
```bash
curl -X GET \
  'https://your-domain.com/api/v1/platform-admin/system/logs/download' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -o combined-2024-01-15.log
```

### Download Specific Log File
```bash
curl -X GET \
  'https://your-domain.com/api/v1/platform-admin/system/logs/download/combined-2024-01-15.log' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -o combined-2024-01-15.log
```

### List Available Log Files
```bash
curl -X GET \
  'https://your-domain.com/api/v1/platform-admin/system/logs/files' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN'
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "filename": "combined-2024-01-15.log",
      "size": 1024000,
      "created": "2024-01-15T00:00:00.000Z",
      "modified": "2024-01-15T23:59:59.000Z"
    },
    {
      "filename": "combined-2024-01-14.log",
      "size": 2048000,
      "created": "2024-01-14T00:00:00.000Z",
      "modified": "2024-01-14T23:59:59.000Z"
    }
  ]
}
```

## File Structure

### Local Development
```
aibigo-server/
  logs/
    combined-2024-01-15.log
    combined-2024-01-14.log
    ...
```

### Vercel/Serverless
```
/tmp/
  logs/
    combined-2024-01-15.log
    combined-2024-01-14.log
    ...
```

## Log File Format

Each line is a JSON object:
```json
{
  "timestamp": "2024-01-15 10:30:00",
  "level": "info",
  "message": "Incoming request",
  "service": "aibigo-server",
  "environment": "production",
  "version": "1.0.0",
  "method": "GET",
  "path": "/api/v1/platform-admin/dashboard/overview",
  "ip": "127.0.0.1",
  "userAgent": "Mozilla/5.0..."
}
```

## Swagger Documentation

The download endpoints are documented in Swagger:
- `GET /api/v1/platform-admin/system/logs/download` - Download today's log
- `GET /api/v1/platform-admin/system/logs/download/{filename}` - Download specific log

**Location**: `src/config/swagger.js`

## Vercel Considerations

### File Persistence
- **Important**: Vercel serverless functions are stateless
- Log files in `/tmp` are **ephemeral** (cleared between deployments)
- For production logging, consider:
  - External logging service (e.g., Logtail, Datadog, CloudWatch)
  - Database storage for critical logs
  - Cloud storage (S3, GCS) for log files

### Current Implementation
- Logs are stored in `/tmp/logs` during function execution
- Files persist during the same deployment
- Files are cleared on new deployments

### Recommended for Production
1. **Short-term**: Use current implementation for development/staging
2. **Long-term**: Integrate with external logging service for production

## Testing

### Local Testing
```bash
# Start server
npm run dev

# Make some API requests to generate logs

# Download today's log
curl -X GET \
  'http://localhost:5000/api/v1/platform-admin/system/logs/download' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -o combined-$(date +%Y-%m-%d).log

# Verify log file
cat combined-$(date +%Y-%m-%d).log
```

### Vercel Testing
1. Deploy to Vercel
2. Make API requests to generate logs
3. Call download endpoint
4. Verify file is downloaded correctly

## Migration Notes

### Old Log Files
- Old log files (error-*.log, api-*.log, etc.) are no longer created
- Existing old log files will remain but won't be updated
- Only `combined-*.log` files are accessible via API

### Cleanup
You can safely delete old log files:
```bash
# Remove old log files (keep combined files)
cd logs/
rm -f error-*.log api-*.log exceptions*.log rejections*.log
```

## Summary

✅ **Single log file per day** - `combined-YYYY-MM-DD.log`
✅ **Download API** - Direct file download via HTTP
✅ **Vercel compatible** - Uses `/tmp` directory in serverless
✅ **Security** - Only allows combined log files, requires authentication
✅ **Swagger documented** - Full API documentation
✅ **All log levels** - debug, info, warn, error in one file

## Next Steps

For production deployments on Vercel, consider:
1. **External logging service** - For persistent log storage
2. **Cloud storage integration** - Upload logs to S3/GCS
3. **Log aggregation** - Use services like Logtail, Datadog, or CloudWatch
4. **Real-time monitoring** - Set up alerts based on log patterns
