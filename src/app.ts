import 'dotenv/config';
import express from 'express';
import apiRouter from './routes/api.js';
import { connectDB } from './config/database.js';
import path from 'path';
import multer from 'multer';

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'gallery');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// const upload = multer({ storage: fileStorage, fileFilter: fileFilter });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static images
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
app.use('/gallery', express.static(path.join(process.cwd(), 'gallery')));

// Enable CORS for all routes
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// All API routes are mounted under /api
app.use('/api', apiRouter);

// Global error handling middleware - must be after all routes
app.use(
  (err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Unhandled error:', err);

    // Handle different error types
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation Error',
        message: err.message,
        details: err.errors || null,
      });
    }

    // Handle express-validator validation errors
    if (err.isValidationError) {
      return res.status(422).json({
        error: 'Validation Failed',
        message: 'Request validation failed',
        errors: err.errors || null,
      });
    }

    if (err.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid ID format',
        message: 'The provided ID is not valid',
      });
    }

    if (err.code === 11000) {
      return res.status(409).json({
        error: 'Duplicate Entry',
        message: 'A record with this data already exists',
      });
    }

    // Default error response
    res.status(err.status || 500).json({
      error: err.name || 'Internal Server Error',
      message: err.message || 'An unexpected error occurred',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }
);

// Handle malformed JSON requests
app.use(
  (err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof SyntaxError && 'body' in err) {
      return res.status(400).json({
        error: 'Invalid JSON',
        message: 'Request body contains malformed JSON',
      });
    }
    next(err);
  }
);

// 404 handler for undefined routes
app.use(/.*/, (req: express.Request, res: express.Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

const startServer = async () => {
  await connectDB();

  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
};

startServer().catch(console.error);
