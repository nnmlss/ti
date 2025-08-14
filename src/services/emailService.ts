import nodemailer from 'nodemailer';
import { ACTIVATION_TOKEN_EXPIRY_MINUTES } from '../config/constants.js';

export class EmailService {
  private static transporter: nodemailer.Transporter | null = null;

  //Initialize email transporter
  static async initialize(): Promise<void> {
    try {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'mail.borislav.space',
        port: parseInt(process.env.SMTP_PORT || '465'),
        secure: process.env.SMTP_SECURE === 'true' || true, // true for 465
        auth: {
          user: process.env.SMTP_USER || 'fly@borislav.space',
          pass: process.env.SMTP_PASS,
        },
      });

      // Verify connection configuration
      await this.transporter!.verify();
      console.log('Email service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize email service:', error);
    }
  }

  //Send account activation email
  static async sendActivationEmail(email: string, token: string): Promise<boolean> {
    if (!this.transporter) {
      console.error('Email service not initialized');
      return false;
    }

    try {
      const activationUrl = `${
        process.env.FRONTEND_URL || 'http://localhost:5173'
      }/activate/${token}`;

      const mailOptions = {
        from: process.env.FROM_EMAIL || 'noreply@borislav.space',
        to: email,
        subject: 'Activate Your Takeoff Info Account',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Welcome to Takeoff Info!</h2>
            <p>Your account has been created and is ready for activation.</p>
            <p>Click the link below to set your username and password:</p>
            <p>
              <a href="${activationUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                Activate Account
              </a>
            </p>
            <p><strong>Important:</strong> This link will expire in ${ACTIVATION_TOKEN_EXPIRY_MINUTES} minutes.</p>
            <p>If you didn't request this account, please ignore this email.</p>
            <hr>
            <p style="color: #666; font-size: 12px;">
              Takeoff Info - Paragliding Sites in Bulgaria
            </p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Activation email sent to ${email}`);
      return true;
    } catch (error) {
      console.error('Failed to send activation email:', error);
      return false;
    }
  }

  //Test email configuration
  static async testConnection(): Promise<boolean> {
    if (!this.transporter) {
      await this.initialize();
    }

    try {
      if (this.transporter) {
        await this.transporter.verify();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Email service test failed:', error);
      return false;
    }
  }
}
