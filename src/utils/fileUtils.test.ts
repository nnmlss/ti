import { describe, it, expect, vi } from 'vitest';
import path from 'path';
import { validateFilename, getGalleryPath } from './fileUtils.js';
import type { NodeError } from '@types';

// Mock the createError function
vi.mock('./errorUtils.js', () => ({
  createError: vi.fn((message: string, status: number) => {
    const error: NodeError = new Error(message);
    error.status = status;
    return error;
  }),
}));

describe('fileUtils', () => {
  describe('validateFilename', () => {
    it('should return decoded filename for valid input', () => {
      const filename = 'test-image.jpg';
      const result = validateFilename(filename);
      
      expect(result).toBe(filename);
    });

    it('should handle URL-encoded filenames', () => {
      const encodedFilename = 'test%20image.jpg';
      const result = validateFilename(encodedFilename);
      
      expect(result).toBe('test image.jpg');
    });

    it('should throw error for filenames with directory traversal (.)', () => {
      const maliciousFilename = '../../../etc/passwd';
      
      expect(() => validateFilename(maliciousFilename)).toThrow();
    });

    it('should throw error for filenames with forward slash', () => {
      const maliciousFilename = 'path/to/file.jpg';
      
      expect(() => validateFilename(maliciousFilename)).toThrow();
    });

    it('should throw error for filenames with backslash', () => {
      const maliciousFilename = 'path\\to\\file.jpg';
      
      expect(() => validateFilename(maliciousFilename)).toThrow();
    });

    it('should handle complex URL-encoded malicious input', () => {
      const encodedMalicious = 'test%2F..%2Ffile.jpg'; // test/../file.jpg
      
      expect(() => validateFilename(encodedMalicious)).toThrow();
    });

    it('should allow filenames with special characters but no path separators', () => {
      const validFilenames = [
        'test-image_v2.jpg',
        'image (1).png',
        'photo@2x.webp',
        'test+image.gif',
        'файл.jpg', // Cyrillic
        'תמונה.png', // Hebrew
      ];

      validFilenames.forEach(filename => {
        expect(() => validateFilename(filename)).not.toThrow();
        expect(validateFilename(filename)).toBe(filename);
      });
    });
  });

  describe('getGalleryPath', () => {
    it('should create path from process.cwd() + gallery + segments', () => {
      const segments = ['thmb', 'image.jpg'];
      const result = getGalleryPath(...segments);
      
      const expected = path.join(process.cwd(), 'gallery', 'thmb', 'image.jpg');
      expect(result).toBe(expected);
    });

    it('should handle single segment', () => {
      const result = getGalleryPath('image.jpg');
      
      const expected = path.join(process.cwd(), 'gallery', 'image.jpg');
      expect(result).toBe(expected);
    });

    it('should handle multiple segments', () => {
      const result = getGalleryPath('subfolder', 'nested', 'image.jpg');
      
      const expected = path.join(process.cwd(), 'gallery', 'subfolder', 'nested', 'image.jpg');
      expect(result).toBe(expected);
    });

    it('should handle no segments (gallery root)', () => {
      const result = getGalleryPath();
      
      const expected = path.join(process.cwd(), 'gallery');
      expect(result).toBe(expected);
    });

    it('should handle empty string segments', () => {
      const result = getGalleryPath('', 'image.jpg');
      
      const expected = path.join(process.cwd(), 'gallery', '', 'image.jpg');
      expect(result).toBe(expected);
    });
  });
});