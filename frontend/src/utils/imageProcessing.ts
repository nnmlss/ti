import type { GalleryImage } from '@app-types';

// Image processing utilities for responsive images and gallery management

/**
 * Get responsive image sources for a gallery image
 * Returns optimized image paths for different screen sizes
 * Backend stores only 'path' but creates responsive versions as .jpg files
 */
export const getResponsiveImageSources = (image: GalleryImage) => {
  // Helper to ensure path starts with / but doesn't have double /gallery/
  const normalizePath = (path: string) => {
    if (path.startsWith('/gallery/')) return path;
    if (path.startsWith('gallery/')) return `/${path}`;
    return `/gallery/${path}`;
  };

  // Helper to extract just the filename and convert to .jpg
  const getJpgFilename = (originalPath: string) => {
    // Extract just the filename (remove any path prefixes)
    const filename = originalPath.replace(/^.*\//, '');
    // Remove any existing extension and add .jpg
    const filenameWithoutExtension = filename.replace(/\.[^/.]+$/, '');
    return `${filenameWithoutExtension}.jpg`;
  };

  // Get just the filename without path for responsive versions
  const jpgFilename = getJpgFilename(image.path);

  return {
    // Large image for desktop (high DPI screens) - always .jpg in /gallery/large/
    largeSrc: image.large ? `/gallery/large/${image.large}` : `/gallery/large/${jpgFilename}`,
    // Small image for mobile/tablet devices - always .jpg in /gallery/small/
    smallSrc: image.small ? `/gallery/small/${image.small}` : `/gallery/small/${jpgFilename}`,
    // Thumbnail for preview/loading states - always .jpg in /gallery/thmb/
    thumbnailSrc: image.thumbnail ? `/gallery/thmb/${image.thumbnail}` : `/gallery/thmb/${jpgFilename}`,
    // Original/fallback image - stored in /gallery/ with original name
    fallbackSrc: normalizePath(image.path)
  };
};

/**
 * Generate alt text for gallery images
 * Creates descriptive alt text based on available image metadata
 */
export const generateImageAltText = (image: GalleryImage, siteName?: string): string => {
  if (image.author) {
    const baseText = siteName ? `${siteName} - Photo by ${image.author}` : `Photo by ${image.author}`;
    return baseText;
  }

  if (siteName) {
    return `${siteName} - Gallery image`;
  }

  return 'Paragliding site gallery image';
};

/**
 * Generate image title attribute for better accessibility and UX
 */
export const generateImageTitle = (image: GalleryImage, siteName?: string): string | undefined => {
  if (image.author) {
    const baseText = siteName ? `${siteName} - Photo by ${image.author}` : `Photo by ${image.author}`;

    // Add image dimensions if available
    if (image.width && image.height) {
      return `${baseText} (${image.width}×${image.height})`;
    }

    return baseText;
  }

  return undefined; // No title if no author
};

/**
 * Check if an image has multiple sizes available
 * Useful for determining if responsive loading is beneficial
 */
export const hasMultipleSizes = (image: GalleryImage): boolean => {
  return !!(image.thumbnail || image.small || image.large);
};

/**
 * Get the best available image source for a specific use case
 */
export const getBestImageSource = (
  image: GalleryImage,
  purpose: 'thumbnail' | 'small' | 'large' | 'original'
): string => {
  const sources = getResponsiveImageSources(image);

  switch (purpose) {
    case 'thumbnail':
      return sources.thumbnailSrc;
    case 'small':
      return sources.smallSrc;
    case 'large':
      return sources.largeSrc;
    case 'original':
    default:
      return sources.fallbackSrc;
  }
};

/**
 * Preload critical images for better performance
 * Returns promises that resolve when images are loaded
 */
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Preload all sizes of a gallery image
 * Useful for slideshow performance optimization
 */
export const preloadGalleryImage = async (image: GalleryImage): Promise<void> => {
  const sources = getResponsiveImageSources(image);
  const promises = [
    preloadImage(sources.fallbackSrc)
  ];

  // Preload additional sizes if they exist and are different
  if (sources.largeSrc !== sources.fallbackSrc) {
    promises.push(preloadImage(sources.largeSrc));
  }
  if (sources.smallSrc !== sources.fallbackSrc) {
    promises.push(preloadImage(sources.smallSrc));
  }

  // Wait for all images to load or fail
  await Promise.allSettled(promises);
};

/**
 * Handle image loading errors gracefully
 * Provides fallback behavior for broken images
 */
export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const img = event.currentTarget;

  // Hide broken images instead of showing broken image icon
  img.style.display = 'none';

  // Optional: log the error for debugging
  if (import.meta.env.DEV) {
    console.warn('Image failed to load:', img.src);
  }
};

/**
 * Get image aspect ratio if dimensions are available
 * Returns undefined if dimensions are not provided
 */
export const getImageAspectRatio = (image: GalleryImage): number | undefined => {
  if (image.width && image.height) {
    return image.width / image.height;
  }
  return undefined;
};

/**
 * Determine if image is landscape or portrait orientation
 */
export const getImageOrientation = (image: GalleryImage): 'landscape' | 'portrait' | 'square' | 'unknown' => {
  const aspectRatio = getImageAspectRatio(image);

  if (!aspectRatio) return 'unknown';

  if (aspectRatio > 1.1) return 'landscape';
  if (aspectRatio < 0.9) return 'portrait';
  return 'square';
};