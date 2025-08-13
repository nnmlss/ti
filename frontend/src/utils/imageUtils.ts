// Utility functions for image path transformations and thumbnail handling

/**
 * Generate thumbnail URL from original image path
 * Transforms: "1234567890-image.png" -> "thmb/1234567890-image.jpg"
 */
export const generateThumbnailUrl = (originalPath: string): string => {
  if (!originalPath) return '';
  
  // Remove any existing folder prefixes
  const filename = originalPath.split('/').pop() || originalPath;
  
  // Get base name without extension
  const baseName = filename.substring(0, filename.lastIndexOf('.')) || filename;
  
  return `thmb/${baseName}.jpg`;
};

/**
 * Generate small image URL from original image path
 * Transforms: "1234567890-image.png" -> "small/1234567890-image.jpg"
 */
export const generateSmallUrl = (originalPath: string): string => {
  if (!originalPath) return '';
  
  const filename = originalPath.split('/').pop() || originalPath;
  const baseName = filename.substring(0, filename.lastIndexOf('.')) || filename;
  
  return `small/${baseName}.jpg`;
};

/**
 * Generate large image URL from original image path
 * Transforms: "1234567890-image.png" -> "large/1234567890-image.jpg"
 */
export const generateLargeUrl = (originalPath: string): string => {
  if (!originalPath) return '';
  
  const filename = originalPath.split('/').pop() || originalPath;
  const baseName = filename.substring(0, filename.lastIndexOf('.')) || filename;
  
  return `large/${baseName}.jpg`;
};

/**
 * Get the full gallery URL for an image path
 */
export const getGalleryUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  
  // Check if path already includes /gallery/ prefix
  if (imagePath.startsWith('/gallery/') || imagePath.startsWith('gallery/')) {
    return imagePath;
  }
  
  return `/gallery/${imagePath}`;
};

/**
 * Extract filename from image path (removes folder prefixes)
 */
export const extractFilename = (imagePath: string): string => {
  if (!imagePath) return '';
  return imagePath.split('/').pop() || imagePath;
};