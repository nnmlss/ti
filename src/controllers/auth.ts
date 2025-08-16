import type { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { createError } from '@utils/errorUtils.js';
import { User } from '@models/user.js';
import type { CustomError } from '@models/sites.js';
import bcrypt from 'bcryptjs';
import { TokenService } from '@services/tokenService.js';
import { EmailService } from '@services/emailService.js';
import { generateToken } from '@middleware/auth.js';
import type { AuthenticatedRequest } from '@middleware/auth.js';

//Request account activation (public endpoint)
export const requestActivation = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const validationError: CustomError = new Error('Validation failed');
    validationError.status = 422;
    validationError.isValidationError = true;
    validationError.errors = errors.array();
    return next(validationError);
  }

  try {
    const { email } = req.body;

    // Generate token (returns null if user doesn't exist)
    const token = await TokenService.generateActivationToken(email);

    if (token) {
      // Send activation email
      await EmailService.sendActivationEmail(email, token);
    }

    // Always return the same message to prevent email enumeration
    res.status(200).json({
      message: 'If your email is registered, you will receive an activation link.',
    });
  } catch (error) {
    next(error);
  }
};

//Validate activation token
export const validateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;

    if (!token) {
      const error: CustomError = new Error('Token is required');
      error.status = 400;
      return next(error);
    }

    const user = await TokenService.validateToken(token);

    if (!user) {
      const error: CustomError = new Error('Invalid or expired token');
      error.status = 400;
      return next(error);
    }

    res.status(200).json({
      message: 'Token is valid',
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
};

//Complete account activation with username/password
export const completeActivation = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const validationError: CustomError = new Error('Validation failed');
    validationError.status = 422;
    validationError.isValidationError = true;
    validationError.errors = errors.array();
    return next(validationError);
  }

  try {
    const { token } = req.params;
    const { username, password } = req.body;

    if (!token) {
      const error: CustomError = new Error('Token is required');
      error.status = 400;
      return next(error);
    }

    // Validate token first
    const user = await TokenService.validateToken(token);

    if (!user) {
      const error: CustomError = new Error('Invalid or expired token');
      error.status = 400;
      return next(error);
    }

    // Hash password
    const passEnc = await bcrypt.hash(password, 15);

    // Update user with username, password and activate account
    await User.updateOne(
      { _id: user._id },
      {
        username: username,
        password: passEnc,
        isActive: true,
      }
    );

    // Clear the token
    await TokenService.clearToken(token);

    res.status(200).json({ message: 'Account activated successfully' });
  } catch (error) {
    next(error);
  }
};

//Login with username/password
export const login = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const validationError: CustomError = new Error('Validation failed');
    validationError.status = 422;
    validationError.isValidationError = true;
    validationError.errors = errors.array();
    return next(validationError);
  }

  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username, isActive: true });

    if (!user || !user.password) {
      const error: CustomError = new Error('Invalid credentials');
      error.status = 401;
      return next(error);
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      const error: CustomError = new Error('Invalid credentials');
      error.status = 401;
      return next(error);
    }

    // Generate JWT token
    const token = generateToken(user);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};

//Admin-only: Create new user accounts with email only
export const createUserAccounts = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const validationError: CustomError = new Error('Validation failed');
    validationError.status = 422;
    validationError.isValidationError = true;
    validationError.errors = errors.array();
    return next(validationError);
  }

  try {
    const { emails } = req.body;

    if (!Array.isArray(emails) || emails.length === 0) {
      const error: CustomError = new Error('Emails array is required');
      error.status = 400;
      return next(error);
    }

    const results = [];

    for (const email of emails) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
          results.push({
            email,
            success: false,
            message: 'User already exists',
          });
          continue;
        }

        // Create user with email only (let MongoDB auto-generate ObjectId)
        const newUser = new User({
          email,
          isActive: false,
        });

        await newUser.save();

        results.push({
          email,
          success: true,
          message: 'Account created successfully',
          id: newUser._id.toString(),
        });
      } catch (userError) {
        console.error('Error creating user:', userError);
        results.push({
          email,
          success: false,
          message: 'Failed to create account',
        });
      }
    }

    res.status(200).json({
      message: 'Account creation process completed',
      results,
    });
  } catch (error) {
    next(error);
  }
};
