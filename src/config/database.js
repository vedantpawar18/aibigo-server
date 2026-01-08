const mongoose = require('mongoose');

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
    console.log(`${connectionType} Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

    return conn;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
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
