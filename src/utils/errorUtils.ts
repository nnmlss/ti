import type { CustomError } from '../models/sites.js';

export const createError = (message: string, status: number): CustomError => {
  const error: CustomError = new Error(message);
  error.status = status;
  return error;
};