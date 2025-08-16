import type { CustomError } from '@types'

export const createError = (message: string, status: number): CustomError => {
  const error: CustomError = new Error(message);
  error.status = status;
  return error;
};
