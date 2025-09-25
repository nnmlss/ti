import mongoose from 'mongoose';
import { logger } from './logger.js';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env['MONGO_URI'];

    if (!mongoURI) {
      throw new Error('MONGO_URI environment variable is not defined');
    }

    await mongoose.connect(mongoURI);
    logger.info('MongoDB connected successfully', { uri: mongoURI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@') });
  } catch (error) {
    logger.error('MongoDB connection error', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  logger.info('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  logger.error('Mongoose connection error', {
    error: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined
  });
});

mongoose.connection.on('disconnected', () => {
  logger.info('Mongoose disconnected from MongoDB');
});

// Note: Graceful shutdown moved to app.ts for proper HTTP server handling
// This file only handles direct DB termination if run standalone
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  logger.info('MongoDB connection closed through app termination');
  process.exit(0);
});
