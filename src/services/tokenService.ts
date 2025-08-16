import crypto from 'crypto';
import { User } from '@models/user.js';
import { ACTIVATION_TOKEN_EXPIRY_MS } from '@config/constants.js';

export class TokenService {
  //Generate a secure random token
  static generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  //Generate activation token for user and set expiry
  static async generateActivationToken(email: string): Promise<string | null> {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return null; // User doesn't exist
      }

      const token = this.generateToken();
      const expiry = new Date(Date.now() + ACTIVATION_TOKEN_EXPIRY_MS);

      await User.updateOne(
        { email },
        {
          invitationToken: token,
          tokenExpiry: expiry,
        }
      );

      return token;
    } catch (error) {
      console.error('Error generating activation token:', error);
      return null;
    }
  }

  //Validate token and return user if valid
  static async validateToken(token: string): Promise<any> {
    try {
      const user = await User.findOne({
        invitationToken: token,
        tokenExpiry: { $gt: new Date() }, // Token not expired
      });

      return user;
    } catch (error) {
      console.error('Error validating token:', error);
      return null;
    }
  }

  //Clear token after successful activation
  static async clearToken(token: string): Promise<boolean> {
    try {
      await User.updateOne(
        { invitationToken: token },
        {
          $unset: {
            invitationToken: 1,
            tokenExpiry: 1,
          },
        }
      );

      return true;
    } catch (error) {
      console.error('Error clearing token:', error);
      return false;
    }
  }

  //Cleanup expired tokens (can be run periodically)
  static async cleanupExpiredTokens(): Promise<void> {
    try {
      await User.updateMany(
        { tokenExpiry: { $lt: new Date() } },
        {
          $unset: {
            invitationToken: 1,
            tokenExpiry: 1,
          },
        }
      );
    } catch (error) {
      console.error('Error cleaning up expired tokens:', error);
    }
  }
}
