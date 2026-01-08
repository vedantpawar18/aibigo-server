const app = require('../src/server');
const { connectDB } = require('../src/config/database');

// Initialize database connection (cached across invocations)
let dbInitialized = false;

async function ensureDatabaseConnection() {
  if (!dbInitialized) {
    try {
      await connectDB();
      dbInitialized = true;
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }
}

// Vercel serverless function handler
module.exports = async function handler(req, res) {
  try {
    // Ensure database is connected
    await ensureDatabaseConnection();
    
    // Set Vercel-specific headers for analytics tracking
    res.setHeader('X-Vercel-Analytics', 'enabled');
    
    // Handle the request with Express app
    app(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined
      });
    }
  }
};
