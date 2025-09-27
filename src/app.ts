import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import morgan from 'morgan';
// createServer removed - wrapper handles server creation
import apiRouter from './routes/api.js';
import authRouter from './routes/auth.js';
import { connectDB } from './config/database.js';
import { EmailService } from './services/emailService.js';
import { setupGraphQLBeforeRoutes } from './graphql/server.js';
// import { gateMiddleware } from './middleware/gateMiddleware.js'; // DISABLED
import path from 'path';
import type { CustomError } from '@types';
import { logger, httpLogStream } from './config/logger.js';

const app = express();

// Set up EJS template engine
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'src/views'));

// Cookie parser MUST come before gate middleware
app.use(cookieParser());

// HTTP request logging with URL decoding for Cyrillic characters
morgan.token('decoded-url', (req) => {
  return decodeURIComponent(req.url || '');
});

morgan.token('decoded-referrer', (req) => {
  const referrer = req.headers['referrer'] || req.headers['referer'] || '-';
  const referrerStr = Array.isArray(referrer) ? referrer[0] : referrer;
  return referrerStr === '-' || !referrerStr ? referrerStr || '-' : decodeURIComponent(referrerStr);
});

// Custom format with decoded URLs
const customFormat = ':remote-addr - - [:date[clf]] ":method :decoded-url HTTP/:http-version" :status :res[content-length] ":decoded-referrer" ":user-agent"';

app.use(morgan(customFormat, { stream: httpLogStream }));

// Apply gate middleware FIRST - before all security middleware (conditionally)
// DISABLED: Gateway middleware temporarily disabled for production
/*
if (process.env['SITE_ACCESS_PASSWORD'] !== 'false') {
  console.log('🔧 Setting up gate middleware...');
  app.use(gateMiddleware);
  console.log('✅ Gate middleware registered');
} else {
  console.log('🔧 Gate middleware disabled (SITE_ACCESS_PASSWORD=false)');
}
*/
logger.info('Gate middleware disabled', { reason: 'Production hosting compatibility' });

// Security middleware with GraphQL Yoga/GraphiQL support
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://unpkg.com'],
        fontSrc: ["'self'", 'data:', 'https://fonts.gstatic.com'],
        imgSrc: [
          "'self'",
          'data:',
          'blob:',
          // Leaflet map tiles
          'https://*.tile.opentopomap.org',
          'https://server.arcgisonline.com',
          'https://*.tile.openstreetmap.org',
          // Leaflet marker icons
          'https://cdnjs.cloudflare.com',
        ],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://unpkg.com'],
        scriptSrcAttr: ["'unsafe-inline'"],
        connectSrc: ["'self'"],
        workerSrc: ["'self'", 'blob:'],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// Dynamic CORS configuration
const getAllowedOrigins = () => {
  if (process.env['NODE_ENV'] === 'production') {
    // In production, allow any subdomain of borislav.space
    return /^https:\/\/([a-zA-Z0-9-]+\.)?borislav\.space$/;
  }
  // In development
  return ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'];
};

app.use(
  cors({
    origin: getAllowedOrigins(),
    credentials: true,
  })
);

// Trust proxy for rate limiting and security headers
app.set('trust proxy', 1);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env['NODE_ENV'] === 'development' ? 1000 : 100, // Higher limit for development
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// TEMPORARILY DISABLE rate limiting for development debugging
if (process.env['NODE_ENV'] === 'production') {
  app.use(limiter);
}

// Cookie parser moved to top of file

// Body parsing with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// URL decoding middleware for Cyrillic/Unicode URLs
app.use((req: express.Request, _res: express.Response, next: express.NextFunction) => {
  try {
    // Only decode if URL contains encoded characters and isn't already decoded
    if (req.url.includes('%') && !req.url.match(/[а-я]/i)) {
      req.url = decodeURIComponent(req.url);
    }
    if (req.originalUrl.includes('%') && !req.originalUrl.match(/[а-я]/i)) {
      req.originalUrl = decodeURIComponent(req.originalUrl);
    }

    // Debug logging in development
    if (process.env['NODE_ENV'] === 'development') {
      console.log('URL handling:', { url: req.url, originalUrl: req.originalUrl });
    }
  } catch (error) {
    // If URL is malformed, continue with original
    console.warn('URL decoding failed:', error);
  }
  next();
});

// Gate access route (BEFORE CSRF protection to avoid blocking)
// DISABLED: Route disabled along with gateway middleware
/*
app.post('/site-access', (req, res) => {
  console.log('🔑 Password submission received!');
  console.log('Body:', req.body);
  console.log('Expected password:', process.env['SITE_ACCESS_PASSWORD']);
  
  const { password } = req.body;
  
  if (!password) {
    console.log('❌ No password provided');
    return res.render('gate', { 
      showGate: true, 
      error: 'Password is required' 
    });
  }
  
  if (password !== process.env['SITE_ACCESS_PASSWORD']) {
    console.log('❌ Password incorrect:', password);
    return res.render('gate', { 
      showGate: true, 
      error: 'Incorrect password' 
    });
  }
  
  // Password correct - set bypass cookie and redirect
  console.log('✅ Password correct! Setting cookie and redirecting');
  res.cookie('site_access', 'granted', { 
    maxAge: 24 * 60 * 60 * 1000 // 24 hours - simplified options
  });
  res.redirect('/');
});
*/

// CSRF Protection via custom headers

// Custom header CSRF protection middleware
const customHeaderProtection = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  // Skip for GET requests, GraphQL and GraphiQL
  if (
    req.method === 'GET' ||
    req.path.startsWith('/graphql') ||
    req.path.startsWith('/graphiql')
  ) {
    return next();
  }

  const customHeader = req.headers['x-requested-with'] as string;

  if (!customHeader || customHeader !== 'XMLHttpRequest') {
    return res
      .status(403)
      .json({ error: 'Missing required custom header for CSRF protection' });
  }

  next();
};

// Remove duplicate - moved above

// Test route to verify server is running and show environment
// DISABLED: Remove test route for production
/*
app.get('/test', (_req, res) => {
  res.json({ 
    message: 'Node.js server is working!', 
    timestamp: new Date().toISOString(),
    siteAccessPassword: process.env['SITE_ACCESS_PASSWORD'] || 'NOT_SET',
    nodeEnv: process.env['NODE_ENV'] || 'NOT_SET'
  });
});
*/

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

// Serve frontend static files
app.use(express.static(path.join(process.cwd(), 'frontend/dist')));

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
    return res.status(errorObj.status || 500).json({
      error: (err instanceof Error ? err.name : undefined) || 'Internal Server Error',
      message:
        (err instanceof Error ? err.message : undefined) || 'An unexpected error occurred',
      ...(process.env['NODE_ENV'] === 'development' &&
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
    return next(err);
  }
);

const startServer = async () => {
  await connectDB();

  // Initialize email service
  try {
    await EmailService.initialize();
    logger.info('Email service initialized successfully');
  } catch (error) {
    logger.warn('Email service initialization failed', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
  }

  // Set up GraphQL BEFORE adding 404 handler
  await setupGraphQLBeforeRoutes(app);

  // Handle 404 for unmatched routes - SPA fallback
  app.use((req: express.Request, res: express.Response) => {
    // For SPA: serve index.html for HTML requests, JSON error for API-like requests
    const acceptsHtml = req.headers.accept?.includes('text/html');

    if (acceptsHtml) {
      res.sendFile(path.join(process.cwd(), 'frontend/dist', 'index.html'));
    } else {
      res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${req.originalUrl} not found`,
      });
    }
  });

  return app; // Return configured app for wrapper
};

// Start server directly when running app.js (not via wrapper)
startServer()
  .then((app) => {
    const server = app.listen(3000, () => {
      logger.info('Server started successfully', {
        port: 3000,
        environment: process.env['NODE_ENV'] || 'development',
        graphqlEndpoint: 'http://localhost:3000/graphql',
      });
    });

    // Graceful shutdown handler
    const gracefulShutdown = (signal: string) => {
      logger.info('Graceful shutdown initiated', { signal });

      // Stop accepting new connections
      server.close(async () => {
        logger.info('HTTP server closed');

        // Close database connections
        try {
          await mongoose.connection.close();
          logger.info('Database connections closed');
          logger.info('Graceful shutdown completed');
          process.exit(0);
        } catch (error) {
          logger.error('Error during database shutdown', {
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
          });
          process.exit(1);
        }
      });

      // Force close after 30 seconds if graceful shutdown hangs
      setTimeout(() => {
        logger.warn('Graceful shutdown timeout - forcing exit');
        process.exit(1);
      }, 30000);
    };

    // Register signal handlers
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  })
  .catch(console.error);

// Export Promise for production wrapper
export default startServer();
