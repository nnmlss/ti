import winston from 'winston';
import path from 'path';

// Define log levels and colors
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

// Custom format for structured logging
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(
    (info) => `${info['timestamp']} ${info.level}: ${info.message}${info['stack'] ? '\n' + info['stack'] : ''}`
  )
);

// Create transports based on environment
const transports = [];

// Always log to console in development
if (process.env['NODE_ENV'] !== 'production') {
  transports.push(
    new winston.transports.Console({
      level: 'debug',
      format: consoleFormat,
    })
  );
} else {
  // In production, use structured JSON format to console
  transports.push(
    new winston.transports.Console({
      level: 'info',
      format: logFormat,
    })
  );
}

// File logging for all environments
transports.push(
  // Error logs
  new winston.transports.File({
    filename: path.join(process.cwd(), 'logs', 'error.log'),
    level: 'error',
    format: logFormat,
  }),
  // Combined logs
  new winston.transports.File({
    filename: path.join(process.cwd(), 'logs', 'combined.log'),
    format: logFormat,
  }),
  // HTTP request logs
  new winston.transports.File({
    filename: path.join(process.cwd(), 'logs', 'http.log'),
    level: 'http',
    format: logFormat,
  })
);

// Create logger instance
export const logger = winston.createLogger({
  level: process.env['LOG_LEVEL'] || (process.env['NODE_ENV'] === 'production' ? 'info' : 'debug'),
  levels,
  format: logFormat,
  transports,
  // Don't exit on handled exceptions
  exitOnError: false,
});

// Create a stream object for Morgan HTTP logging
export const httpLogStream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

// Helper functions for common logging patterns
export const logRequestStart = (method: string, url: string, requestId?: string) => {
  logger.http('Request started', {
    method,
    url,
    requestId,
    timestamp: new Date().toISOString(),
  });
};

export const logRequestEnd = (
  method: string,
  url: string,
  statusCode: number,
  responseTime: number,
  requestId?: string
) => {
  logger.http('Request completed', {
    method,
    url,
    statusCode,
    responseTime: `${responseTime}ms`,
    requestId,
    timestamp: new Date().toISOString(),
  });
};

export const logDatabaseOperation = (operation: string, collection: string, duration?: number) => {
  logger.debug('Database operation', {
    operation,
    collection,
    duration: duration ? `${duration}ms` : undefined,
    timestamp: new Date().toISOString(),
  });
};

export const logGraphQLOperation = (
  operationName: string,
  operationType: 'query' | 'mutation',
  variables?: Record<string, unknown>,
  duration?: number
) => {
  logger.info('GraphQL operation', {
    operationName,
    operationType,
    variables,
    duration: duration ? `${duration}ms` : undefined,
    timestamp: new Date().toISOString(),
  });
};

export const logEmailOperation = (operation: string, recipient?: string, success?: boolean) => {
  logger.info('Email operation', {
    operation,
    recipient: recipient ? recipient.replace(/(.{3}).*(@.*)/, '$1***$2') : undefined, // Mask email
    success,
    timestamp: new Date().toISOString(),
  });
};

export const logSecurityEvent = (
  event: string,
  ip: string,
  userAgent?: string,
  details?: Record<string, unknown>
) => {
  logger.warn('Security event', {
    event,
    ip,
    userAgent,
    ...details,
    timestamp: new Date().toISOString(),
  });
};

// Ensure logs directory exists
import fs from 'fs';
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}