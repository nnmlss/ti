import { describe, it, expect } from 'vitest';
import { createError } from './errorUtils.js';

describe('errorUtils', () => {
  describe('createError', () => {
    it('should create a CustomError with message and status', () => {
      const message = 'Test error message';
      const status = 400;

      const error = createError(message, status);

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(message);
      expect(error.status).toBe(status);
    });

    it('should create a CustomError with different status codes', () => {
      const error404 = createError('Not found', 404);
      const error500 = createError('Internal server error', 500);

      expect(error404.status).toBe(404);
      expect(error404.message).toBe('Not found');
      
      expect(error500.status).toBe(500);
      expect(error500.message).toBe('Internal server error');
    });

    it('should preserve Error prototype methods', () => {
      const error = createError('Test error', 400);

      expect(error.name).toBe('Error');
      expect(error.toString()).toBe('Error: Test error');
      expect(error.stack).toBeDefined();
    });
  });
});