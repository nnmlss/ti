import path from 'path';
import { createError } from './errorUtils.js';

export const validateFilename = (filename: string): string => {
  const decodedFilename = decodeURIComponent(filename);
  
  if (decodedFilename.includes('..') || decodedFilename.includes('/') || decodedFilename.includes('\\')) {
    throw createError('Invalid filename', 400);
  }
  
  return decodedFilename;
};

export const getGalleryPath = (...segments: string[]): string => {
  return path.join(process.cwd(), 'gallery', ...segments);
};