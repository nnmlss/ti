import 'dotenv/config';
import express from 'express';
import apiRouter from './routes/api.js';
// import authRouter from './routes/auth.js';
import { connectDB } from './config/database.js';
import path from 'path';
import type { CustomError } from './models/sites.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for all routes
app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// All API and AUTH routes are mounted under /api and /auth
app.use('/api', apiRouter);
// app.use('/auth', authRouter);

// Serve static images - must come after API routes
app.use('/gallery', express.static(path.join(process.cwd(), 'gallery')));

// 404 handler for undefined routes - must be the last route handler
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// Global error handling middleware - must be after all routes
app.use(
  (err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Unhandled error:', err);

    // Handle different error types
    if (err instanceof Error && err.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation Error',
        message: err.message,
        details: 'errors' in err ? err.errors : null,
      });
    }

    // Handle express-validator validation errors
    const customErr = err as CustomError;
    if (customErr.isValidationError) {
      return res.status(422).json({
        error: 'Validation Failed',
        message: 'Request validation failed',
        errors: customErr.errors || null,
      });
    }

    if (err instanceof Error && err.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid ID format',
        message: 'The provided ID is not valid',
      });
    }

    if (err && typeof err === 'object' && 'code' in err && err.code === 11000) {
      return res.status(409).json({
        error: 'Duplicate Entry',
        message: 'A record with this data already exists',
      });
    }

    // Default error response
    const errorObj = err as CustomError;
    res.status(errorObj.status || 500).json({
      error: (err instanceof Error ? err.name : undefined) || 'Internal Server Error',
      message:
        (err instanceof Error ? err.message : undefined) || 'An unexpected error occurred',
      ...(process.env.NODE_ENV === 'development' &&
        err instanceof Error && { stack: err.stack }),
    });
  }
);

// Handle malformed JSON requests
app.use(
  (err: unknown, _req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof SyntaxError && 'body' in err) {
      return res.status(400).json({
        error: 'Invalid JSON',
        message: 'Request body contains malformed JSON',
      });
    }
    next(err);
  }
);

const startServer = async () => {
  await connectDB();

  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
};

startServer().catch(console.error);
