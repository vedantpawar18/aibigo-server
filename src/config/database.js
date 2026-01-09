const mongoose = require('mongoose');
const logger = require('./logger');

/**
 * Connect to MongoDB database
 * Uses repository pattern for abstraction - can be replaced with other DBs
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('MONGODB_URI environment variable is required. Please set it in your .env file.');
    }
    
    // Mongoose 6+ has these options enabled by default, no need to specify
    // Works with both MongoDB Atlas (mongodb+srv://) and local MongoDB (mongodb://)
    const conn = await mongoose.connect(mongoURI);

    const connectionType = mongoURI.includes('mongodb+srv://') ? 'MongoDB Atlas' : 'MongoDB';
    logger.info(`${connectionType} Connected`, {
      host: conn.connection.host,
      database: conn.connection.name,
    });
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error', {
        error: err.message,
        stack: err.stack,
      });
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      logger.info('Shutting down gracefully...');
      await mongoose.connection.close();
      logger.info('MongoDB connection closed through app termination');
      process.exit(0);
    });

    return conn;
  } catch (error) {
    logger.error('Error connecting to MongoDB', {
      error: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
};

/**
 * Disconnect from MongoDB
 */
const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error.message);
  }
};

module.exports = {
  connectDB,
  disconnectDB,
  mongoose,
};
