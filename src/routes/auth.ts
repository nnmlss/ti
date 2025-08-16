import { Router } from 'express';
import { EmailService } from '@services/emailService.js';

const router = Router();

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
        FROM_EMAIL: process.env.FROM_EMAIL || 'not set',
      },
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

export default router;
