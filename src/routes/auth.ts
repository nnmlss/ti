import express, { Router } from 'express';
import { body } from 'express-validator';
import { requestActivation, validateToken, completeActivation, login, createUserAccounts } from '../controllers/auth.js';
import { EmailService } from '../services/emailService.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Public endpoint to request activation
router.post(
  '/request-activation',
  [
    body('email')
      .isEmail()
      .withMessage('Invalid email address')
      .normalizeEmail(),
  ],
  requestActivation
);

// Validate token
router.get('/validate/:token', validateToken);

// Complete activation with username/password
router.post(
  '/activate/:token',
  [
    body('username')
      .trim()
      .isLength({ min: 3 })
      .withMessage('Username must be at least 3 characters long'),
    body('password')
      .trim()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
  ],
  completeActivation
);

// Login endpoint
router.post(
  '/login',
  [
    body('username')
      .trim()
      .notEmpty()
      .withMessage('Username is required'),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ],
  login
);

// Admin-only: Create user accounts
router.post(
  '/admin/create-accounts',
  authenticate,
  requireAdmin,
  [
    body('emails')
      .isArray({ min: 1 })
      .withMessage('Emails array is required with at least one email'),
    body('emails.*')
      .isEmail()
      .withMessage('All emails must be valid')
      .normalizeEmail(),
  ],
  createUserAccounts
);

// Test email service (development only)
router.get('/test-email', async (_req, res) => {
  try {
    const isWorking = await EmailService.testConnection();
    res.json({ 
      emailService: isWorking ? 'working' : 'not working',
      environment: {
        SMTP_HOST: process.env.SMTP_HOST || 'not set',
        SMTP_PORT: process.env.SMTP_PORT || 'not set',
        SMTP_USER: process.env.SMTP_USER || 'not set',
        FROM_EMAIL: process.env.FROM_EMAIL || 'not set'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

export default router;
