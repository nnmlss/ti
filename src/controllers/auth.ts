import type { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { createError } from '../utils/errorUtils.js';
import { User } from '../models/user.js';

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req;
  } catch (error) {
    next(error);
  }
};
