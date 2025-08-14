import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';
import type { CustomError } from '../models/sites.js';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
    isActive: boolean;
    isSuperAdmin?: boolean;
  };
}

//Generate JWT token for authenticated user
export const generateToken = (user: any): string => {
  const payload = {
    id: user._id,
    email: user.email,
    username: user.username,
    isActive: user.isActive,
    isSuperAdmin: user.isSuperAdmin,
  };
  
  return jwt.sign(payload, process.env.JWT_SECRET || 'fallback-secret', {
    expiresIn: '7d',
  });
};

//Middleware to authenticate user via JWT
export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      const error: CustomError = new Error('Access token required');
      error.status = 401;
      return next(error);
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    
    // Verify user still exists and is active
    const user = await User.findOne({ _id: decoded.id, isActive: true });
    
    if (!user) {
      const error: CustomError = new Error('User not found or inactive');
      error.status = 401;
      return next(error);
    }
    
    req.user = {
      id: user._id.toString(),
      email: user.email,
      username: user.username || '',
      isActive: user.isActive,
      isSuperAdmin: user.isSuperAdmin || false,
    };
    
    next();
  } catch (error) {
    const authError: CustomError = new Error('Invalid access token');
    authError.status = 401;
    next(authError);
  }
};

//Middleware to check if user is super admin
export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user?.isSuperAdmin) {
    const error: CustomError = new Error('Super admin access required');
    error.status = 403;
    return next(error);
  }
  
  next();
};

export type { AuthenticatedRequest };