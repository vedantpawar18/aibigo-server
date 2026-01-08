const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const swaggerSpec = require('./config/swagger');
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
  // Get the base URL from the request
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const swaggerJsonUrl = `${baseUrl}/api/swagger`;
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>aibigo-server API - Swagger UI</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
  <style>
    html {
      box-sizing: border-box;
      overflow: -moz-scrollbars-vertical;
      overflow-y: scroll;
    }
    *, *:before, *:after {
      box-sizing: inherit;
    }
    body {
      margin: 0;
      background: #1a1a1a;
      color: #ffffff;
    }
    .swagger-ui .topbar {
      display: none;
    }
    /* Dark Theme Styles */
    .swagger-ui {
      color: #ffffff;
    }
    .swagger-ui .info {
      background: #2d2d2d;
      color: #ffffff;
    }
    .swagger-ui .info .title {
      color: #ffffff;
    }
    .swagger-ui .scheme-container {
      background: #2d2d2d;
    }
    .swagger-ui .opblock.opblock-post {
      background: #2d2d2d;
      border-color: #49cc90;
    }
    .swagger-ui .opblock.opblock-get {
      background: #2d2d2d;
      border-color: #61affe;
    }
    .swagger-ui .opblock.opblock-put {
      background: #2d2d2d;
      border-color: #fca130;
    }
    .swagger-ui .opblock.opblock-delete {
      background: #2d2d2d;
      border-color: #f93e3e;
    }
    .swagger-ui .opblock.opblock-patch {
      background: #2d2d2d;
      border-color: #50e3c2;
    }
    .swagger-ui .opblock .opblock-summary {
      background: #1a1a1a;
    }
    .swagger-ui .opblock .opblock-summary-method {
      color: #ffffff;
    }
    .swagger-ui .opblock-body {
      background: #1a1a1a;
    }
    .swagger-ui .opblock-description-wrapper,
    .swagger-ui .opblock-external-docs-wrapper,
    .swagger-ui .opblock-title {
      background: #1a1a1a;
      color: #ffffff;
    }
    .swagger-ui .parameter__name,
    .swagger-ui .parameter__type,
    .swagger-ui .parameter__in {
      color: #ffffff;
    }
    .swagger-ui .btn.execute {
      background: #49cc90;
      color: #ffffff;
    }
    .swagger-ui .btn.cancel {
      background: #f93e3e;
      color: #ffffff;
    }
    .swagger-ui input[type=text],
    .swagger-ui input[type=password],
    .swagger-ui input[type=search],
    .swagger-ui input[type=email],
    .swagger-ui textarea,
    .swagger-ui select {
      background: #2d2d2d;
      color: #ffffff;
      border-color: #555555;
    }
    .swagger-ui .response-col_status {
      color: #ffffff;
    }
    .swagger-ui .response-col_links {
      color: #ffffff;
    }
    .swagger-ui .model-box {
      background: #2d2d2d;
      color: #ffffff;
    }
    .swagger-ui .model-title {
      color: #ffffff;
    }
    .swagger-ui .prop-name {
      color: #ffffff;
    }
    .swagger-ui .prop-type {
      color: #61affe;
    }
    .swagger-ui table thead tr td,
    .swagger-ui table thead tr th {
      background: #2d2d2d;
      color: #ffffff;
    }
    .swagger-ui table tbody tr td {
      background: #1a1a1a;
      color: #ffffff;
    }
    .swagger-ui .response-content-type {
      color: #ffffff;
    }
    .swagger-ui .highlight-code {
      background: #1a1a1a;
    }
    .swagger-ui .microlight {
      background: #1a1a1a;
      color: #ffffff;
    }
    .swagger-ui .auth-btn-wrapper {
      background: #2d2d2d;
    }
    .swagger-ui .auth-container {
      background: #2d2d2d;
    }
    .swagger-ui .auth-wrapper {
      background: #2d2d2d;
    }
    .swagger-ui .authorization__btn {
      background: #49cc90;
      color: #ffffff;
    }
    .swagger-ui .btn.authorize {
      background: #49cc90;
      color: #ffffff;
    }
    .swagger-ui .btn-done {
      background: #49cc90;
      color: #ffffff;
    }
    .swagger-ui .scheme-container {
      background: #2d2d2d;
    }
    .swagger-ui .loading-container {
      background: #1a1a1a;
    }
    .swagger-ui .loading::after {
      border-color: #49cc90 transparent transparent transparent;
    }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      const ui = SwaggerUIBundle({
        url: '${swaggerJsonUrl}',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout",
        persistAuthorization: true,
        displayRequestDuration: true
      });
    };
  </script>
</body>
</html>`;
  res.send(html);
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