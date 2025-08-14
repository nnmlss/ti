import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import session from 'express-session';
import csrf from 'csrf';
import apiRouter from './routes/api.js';
import authRouter from './routes/auth.js';
import { connectDB } from './config/database.js';
import { EmailService } from './services/emailService.js';
import path from 'path';
import type { CustomError } from './models/sites.js';

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      fontSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:"],
      scriptSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// Dynamic CORS configuration based on environment
const getAllowedOrigins = () => {
  if (process.env.NODE_ENV === 'production') {
    // In production, allow any subdomain of borislav.space
    return /^https:\/\/([a-zA-Z0-9-]+\.)?borislav\.space$/;
  }
  // In development
  return ['http://localhost:5173', 'http://localhost:3000'];
};

app.use(cors({
  origin: getAllowedOrigins(),
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.use('/api/auth', authLimiter);

// Session middleware for CSRF
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
}));

// Body parsing with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CSRF Protection
const tokens = new csrf();

// CSRF token endpoint
app.get('/api/csrf-token', (req, res) => {
  const secret = tokens.secretSync();
  const token = tokens.create(secret);
  
  // Store secret in session
  (req.session as any).csrfSecret = secret;
  
  res.json({ csrfToken: token });
});

// CSRF validation middleware
const csrfProtection = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Skip CSRF for GET requests and auth endpoints (they use JWT)
  if (req.method === 'GET' || req.path.startsWith('/api/auth/')) {
    return next();
  }
  
  const token = req.headers['x-csrf-token'] as string;
  const secret = (req.session as any).csrfSecret;
  
  if (!token || !secret || !tokens.verify(secret, token)) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }
  
  next();
};

app.use('/api', csrfProtection);

// All API and AUTH routes are mounted under /api and /auth
app.use('/api', apiRouter);
app.use('/auth', authRouter);

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
  
  // Initialize email service
  try {
    await EmailService.initialize();
  } catch (error) {
    console.warn('Email service initialization failed:', error);
  }

  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
};

startServer().catch(console.error);
