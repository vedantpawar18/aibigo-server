# Logger Fix Summary - Always Store Logs

## Issue
Logger was only storing logs to files in production or when `LOG_TO_FILE=true`. Logs should be stored in **every case** (development and production).

## ✅ Fixes Applied

### 1. **File Transports Always Enabled**
**Before**: File transports only enabled in production or with `LOG_TO_FILE=true`
**After**: File transports **always enabled** regardless of environment

**Location**: `src/config/logger.js`

**Changes**:
- Removed conditional check: `if (process.env.NODE_ENV === 'production' || process.env.LOG_TO_FILE === 'true')`
- File transports now always added to logger
- All logs written to files in development and production

### 2. **Enhanced Exception/Rejection Handlers**
**Before**: Basic file handlers
**After**: Multiple handlers (console + file + daily rotate file)

**Changes**:
- Console handler for immediate visibility
- Static file handler (`exceptions.log`, `rejections.log`)
- Daily rotate file handler (`exceptions-YYYY-MM-DD.log`, `rejections-YYYY-MM-DD.log`)
- All exceptions and rejections now logged to files

### 3. **Logger Initialization Verification**
**Added**:
- Logs directory writability check
- Logger initialization logging (written to files)
- Error handling for logger failures
- Fallback file writing if logger fails

### 4. **Replaced console.log/error with Logger**
**Updated Files**:
- `src/services/auth.service.js` - Password reset logging
- `src/services/system.service.js` - Admin user creation logging
- `src/controllers/auth.controller.js` - Login logging errors
- `src/utils/auditLogger.util.js` - Audit logging errors

**Result**: All logging now goes through Winston and is written to files

## Log Files Created

### Always Created (Every Case):
1. **`combined-YYYY-MM-DD.log`** - All logs (info level and above)
2. **`error-YYYY-MM-DD.log`** - Error logs only
3. **`api-YYYY-MM-DD.log`** - API request logs
4. **`exceptions.log`** - Uncaught exceptions (static)
5. **`exceptions-YYYY-MM-DD.log`** - Uncaught exceptions (rotated)
6. **`rejections.log`** - Unhandled promise rejections (static)
7. **`rejections-YYYY-MM-DD.log`** - Unhandled promise rejections (rotated)
8. **`logger-errors.log`** - Logger errors (fallback)

## Verification

### Check Logs Directory:
```bash
cd aibigo-server
ls -la logs/
```

You should see:
- `combined-YYYY-MM-DD.log` (today's date)
- `error-YYYY-MM-DD.log` (if any errors)
- `api-YYYY-MM-DD.log` (API requests)
- `exceptions.log` (if any exceptions)
- `rejections.log` (if any rejections)

### Test Logging:
1. Start the server:
   ```bash
   npm run dev
   ```

2. Make some API requests

3. Check log files:
   ```bash
   # View combined logs
   tail -f logs/combined-$(date +%Y-%m-%d).log
   
   # View API logs
   tail -f logs/api-$(date +%Y-%m-%d).log
   ```

4. Verify logs are being written:
   - Logs should appear in files immediately
   - Files should be created automatically
   - Logs should be in JSON format

## Log Format

All file logs are in JSON format:
```json
{
  "timestamp": "2024-01-15 10:30:00",
  "level": "info",
  "message": "Incoming request",
  "service": "aibigo-server",
  "environment": "development",
  "version": "1.0.0",
  "requestId": "req-1234567890-abc123",
  "method": "GET",
  "path": "/api/v1/platform-admin/dashboard/overview",
  "ip": "127.0.0.1",
  "userAgent": "Mozilla/5.0..."
}
```

## Configuration

### Environment Variables (Optional):
```env
# Log level (error, warn, info, debug)
LOG_LEVEL=info

# Node environment
NODE_ENV=development
```

**Note**: File logging is now **always enabled** regardless of these variables.

## Log Retention

- **Combined logs**: 14 days
- **Error logs**: 30 days
- **API logs**: 14 days
- **Exception logs**: 30 days
- **Rejection logs**: 30 days
- **Max file size**: 20MB per file

## What Gets Logged

### Always Logged to Files:
1. ✅ Server startup/shutdown
2. ✅ Database connections
3. ✅ All HTTP requests (via Morgan + requestLogger)
4. ✅ All HTTP responses
5. ✅ All errors (via errorLogger)
6. ✅ All exceptions (uncaught)
7. ✅ All promise rejections (unhandled)
8. ✅ Audit events (via auditLogger)
9. ✅ Password reset tokens
10. ✅ Admin user creation
11. ✅ All logger.info/error/warn/debug calls

## Troubleshooting

### Issue: Logs not appearing in files

**Check**:
1. Logs directory exists: `ls logs/`
2. Directory is writable: Check permissions
3. Server is running: Check process
4. Check logger initialization message in console

**Solution**:
```bash
# Check directory permissions
chmod 755 logs/

# Check if directory exists
mkdir -p logs/

# Verify logger initialization
# Should see: "Logger initialized" in console
```

### Issue: Log files not rotating

**Check**:
- File size (should rotate at 20MB)
- Date pattern (should create new file daily)
- Winston daily rotate file is installed

**Solution**:
```bash
npm install winston-daily-rotate-file
```

## Summary

✅ **File logging always enabled** (development and production)
✅ **All console.log/error replaced** with logger
✅ **Exception/rejection handlers** enhanced
✅ **Logger initialization** verified
✅ **Error handling** for logger failures
✅ **Log retention** configured
✅ **Multiple log files** for different purposes

**Result**: All logs are now stored to files in every case, ensuring complete logging for debugging and monitoring.
