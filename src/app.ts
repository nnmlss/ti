import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import session from 'express-session';
import { createServer } from 'http';
import apiRouter from './routes/api.js';
import authRouter from './routes/auth.js';
import { connectDB } from './config/database.js';
import { EmailService } from './services/emailService.js';
import { setupGraphQLBeforeRoutes } from './graphql/server.js';
import path from 'path';
import type { CustomError } from '@types'

const app = express();

// Security middleware with GraphQL Yoga/GraphiQL support
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com"],
      fontSrc: ["'self'", "data:", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "blob:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://unpkg.com"],
      scriptSrcAttr: ["'unsafe-inline'"],
      connectSrc: ["'self'"],
      workerSrc: ["'self'", "blob:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// Dynamic CORS configuration
const getAllowedOrigins = () => {
  if (process.env.NODE_ENV === 'production') {
    // In production, allow any subdomain of borislav.space
    return /^https:\/\/([a-zA-Z0-9-]+\.)?borislav\.space$/;
  }
  // In development
  return ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'];
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


app.use(limiter);

// Session middleware for CSRF
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Body parsing with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CSRF Protection via custom headers

// Custom header CSRF protection middleware
const customHeaderProtection = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Skip for GET requests, GraphQL and GraphiQL
  if (req.method === 'GET' || req.path.startsWith('/graphql') || req.path.startsWith('/graphiql')) {
    return next();
  }

  const customHeader = req.headers['x-requested-with'] as string;

  if (!customHeader || customHeader !== 'XMLHttpRequest') {
    return res.status(403).json({ error: 'Missing required custom header for CSRF protection' });
  }

  next();
};

// Apply CSRF protection to /api routes (except auth test endpoint)
app.use('/api/auth', (req, res, next) => {
  // Skip CSRF for test-email endpoint
  if (req.path === '/test-email') {
    return next();
  }
  customHeaderProtection(req, res, next);
});
app.use('/api/auth', authRouter);

// Then apply CSRF protection to remaining /api routes
app.use('/api', customHeaderProtection);
app.use('/api', apiRouter);

// Serve static images - must come after API routes
app.use('/gallery', express.static(path.join(process.cwd(), 'gallery')));

// 404 handler will be added after GraphQL setup in startServer function

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

  // Set up GraphQL BEFORE adding 404 handler
  await setupGraphQLBeforeRoutes(app);

  // NOW add the 404 handler after GraphQL is set up
  app.use((req: express.Request, res: express.Response) => {
    res.status(404).json({
      error: 'Not Found',
      message: `Route ${req.method} ${req.originalUrl} not found`,
    });
  });

  // Create HTTP server
  const httpServer = createServer(app);


  httpServer.listen(3000, () => {
    console.log('Server is running on port 3000');
    console.log('GraphQL Playground available at http://localhost:3000/graphql');
  });
};

startServer().catch(console.error);
