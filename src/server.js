const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const swaggerSpec = require('./config/swagger');
const { getSwaggerUiHtml } = require('./config/swagger-ui');
const { connectDB } = require('./config/database');
const logger = require('./config/logger');
const requestLogger = require('./middleware/requestLogger.middleware');
const errorLogger = require('./middleware/errorLogger.middleware');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration - Simple configuration like Archive project
// Use default CORS which allows all origins (needed for Vercel preview URLs)

// Rate Limiting Configuration
// More lenient in development, stricter in production
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 500, // Higher limit in development
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for OPTIONS requests
    if (req.method === 'OPTIONS') return true;
    // Skip rate limiting in development for authenticated users
    if (process.env.NODE_ENV === 'development' && req.headers.authorization) return false;
    return false;
  },
  // Add retry-after header
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests',
      message: 'Too many requests from this IP, please try again later.',
      statusCode: 429,
      retryAfter: Math.ceil(limiter.windowMs / 1000)
    });
  }
});

// Trust proxy (for Vercel/Railway behind reverse proxy)
app.set('trust proxy', true);

// Middleware - Simple CORS like Archive project
app.use(cors()); // Default CORS allows all origins
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (before morgan for request ID)
app.use(requestLogger);

// Morgan HTTP request logging (integrated with Winston)
app.use(morgan('combined', { stream: logger.stream }));

// Disable caching for API responses (for development)
app.use('/api/', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Apply rate limiting to all API routes (OPTIONS are skipped automatically)
app.use('/api/', limiter);

// Health check endpoint
app.get('/health', async (req, res) => {
  const { mongoose } = require('./config/database');
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: dbStatus
  });
});

// API v1 Routes
app.get('/api/v1/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: 'v1'
  });
});

// Import route files
const authRoutes = require('./routes/auth.routes');
const systemRoutes = require('./routes/system.routes');
const platformAdminRoutes = require('./routes/platform-admin.routes');
const logRoutes = require('./routes/log.routes');

// Handle OPTIONS for all API routes (CORS preflight)
app.options('/api/v1/*', (req, res) => {
  const origin = req.get('origin');
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.status(204).send();
});

// Register routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/system', systemRoutes);
app.use('/api/v1/platform-admin', platformAdminRoutes);
app.use('/api/v1/platform-admin/system/logs', logRoutes);

// Swagger JSON endpoint - Accessible in all environments
app.get('/api/swagger', (req, res) => {
  // Set CORS headers to allow requests from any origin
  const origin = req.get('origin');
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');
  res.json(swaggerSpec);
});

// Handle OPTIONS request for CORS preflight
app.options('/api/swagger', (req, res) => {
  const origin = req.get('origin');
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(204).send();
});

// Swagger JSON endpoint (alternative path)
app.get('/api-docs.json', (req, res) => {
  const origin = req.get('origin');
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');
  res.json(swaggerSpec);
});

// Handle OPTIONS for alternative path
app.options('/api-docs.json', (req, res) => {
  const origin = req.get('origin');
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(204).send();
});

// Swagger UI HTML (CDN-based for Vercel/serverless compatibility)
app.get('/api-docs', (req, res) => {
  res.send(getSwaggerUiHtml());
});

// Root endpoint with Swagger link
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to aibigo-server',
    status: 'Server is running successfully',
    documentation: `${req.protocol}://${req.get('host')}/api-docs`,
    apiVersion: 'v1',
    environment: process.env.NODE_ENV || 'development',
  });
});

// Error handling middleware (must be after all routes)
app.use(errorLogger);

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: message,
    message: process.env.NODE_ENV === 'development' ? err.message : message,
    statusCode,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start server
const startServer = async () => {
  try {
    logger.info('Starting server...', {
      port: PORT,
      environment: process.env.NODE_ENV || 'development',
    });

    // Connect to database
    await connectDB();
    
    // Start Express server
    app.listen(PORT, () => {
      const baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.API_BASE_URL || `http://localhost:${PORT}`;
      
      logger.info('Server started successfully', {
        baseUrl,
        port: PORT,
        environment: process.env.NODE_ENV || 'development',
        swaggerDocs: `${baseUrl}/api-docs`,
      });
    });
  } catch (error) {
    logger.error('Failed to start server', {
      error: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
};

// Export for Vercel serverless functions
module.exports = app;

// Start server only if not in Vercel environment
if (process.env.VERCEL !== '1') {
  startServer();
}