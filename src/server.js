const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const swaggerSpec = require('./config/swagger');
const { getSwaggerUiHtml } = require('./config/swagger-ui');
const { connectDB } = require('./config/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Type', 'Authorization']
};

// Rate Limiting Configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Logger Configuration
const loggerFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';

// Trust proxy (for Vercel/Railway behind reverse proxy)
app.set('trust proxy', true);

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(loggerFormat));

// Disable caching for API responses (for development)
app.use('/api/', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

app.use('/api/', limiter); // Apply rate limiting to all API routes

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

// Register routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/system', systemRoutes);
app.use('/api/v1/platform-admin', platformAdminRoutes);

// Swagger JSON endpoint - Accessible in all environments
app.get('/api/swagger', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow CORS for Swagger JSON
  res.json(swaggerSpec);
});

// Swagger JSON endpoint (alternative path)
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow CORS for Swagger JSON
  res.json(swaggerSpec);
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

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Start Express server
    app.listen(PORT, () => {
      const baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.RAILWAY_PUBLIC_DOMAIN 
          ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
          : `http://localhost:${PORT}`;
      
      console.log(`Server is running on ${baseUrl}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Swagger Documentation: ${baseUrl}/api-docs`);
      console.log(`Swagger JSON: ${baseUrl}/api-docs.json`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();