import mongoose from 'mongoose';

// Track connection status
let isConnected = false;

// Optional: Log connection string (redacted for security)
const logConnectionString = () => {
  if (process.env.MONGO_URI) {
    const redactedUri = process.env.MONGO_URI.replace(/:[^@]+@/, ':<password>@');
    console.log('MONGO_URI:', redactedUri);
  } else {
    console.error('❌ MONGO_URI is not defined in environment variables');
  }
};

export default async function connectToDatabase() {
  // Check if already connected using Mongoose's readyState
  if (mongoose.connection.readyState === 1) {
    console.log('✅ Using existing MongoDB connection');
    isConnected = true;
    return;
  }

  // Validate MONGO_URI
  if (!process.env.MONGO_URI) {
    const error = new Error('MONGO_URI is not defined in environment variables');
    console.error('❌', error.message);
    throw error;
  }

  try {
    console.log('Attempting to connect to MongoDB...');
    logConnectionString();

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000, // Wait 30s for server selection
      connectTimeoutMS: 30000, // Wait 30s for initial connection
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      maxPoolSize: 10, // Limit connection pool size
      minPoolSize: 2, // Maintain at least 2 connections
      heartbeatFrequencyMS: 10000, // Check server status every 10s
    });

    isConnected = true;
    console.log('✅ MongoDB connected successfully');

    // Set up connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to MongoDB');
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('Mongoose disconnected from MongoDB');
      isConnected = false;
    });

    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err.message, err);
      isConnected = false;
    });

  } catch (error) {
    console.error('❌ MongoDB connection error:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
    isConnected = false;
    throw error;
  }
}