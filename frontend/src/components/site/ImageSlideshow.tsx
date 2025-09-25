import React from 'react';
import Box from '@mui/material/Box';
import { useImageSlideshow } from '@hooks/business/useImageSlideshow';
import { getResponsiveImageSources, generateImageAltText, generateImageTitle, handleImageError } from '@utils/imageProcessing';
import type { GalleryImage, SlideshowConfig } from '@app-types';

// Slideshow configuration constants - adapted from geomanch
const SLIDESHOW_CONFIG: SlideshowConfig = {
  autoPlayInterval: 5500, // 5.5 seconds
  transitionDuration: 960, // 0.96 seconds
  transitionEasing: 'ease-in-out', // CSS easing
  transitionType: 'zoom', // 'slide', 'fade', 'zoom' - using zoom for TakeOff Info
  pauseOnHover: true,
  enableDrag: true, // Enable drag/swipe on mobile
  minSwipeDistance: 50,
};

// Image rendering helper function - adapted for TakeOff Info gallery structure
function renderImageElement(image: GalleryImage, siteName?: string): React.ReactNode {
  // Get responsive image sources using utility function
  const { largeSrc, smallSrc, fallbackSrc } = getResponsiveImageSources(image);

  // Don't render if no valid source
  if (!fallbackSrc) {
    return null;
  }

  return (
    <picture>
      {/* Large image for desktop (md and up) */}
      {largeSrc && largeSrc !== fallbackSrc && (
        <source media='(min-width: 900px)' srcSet={largeSrc} />
      )}
      {/* Small image for mobile/tablet */}
      {smallSrc && smallSrc !== fallbackSrc && (
        <source media='(max-width: 899px)' srcSet={smallSrc} />
      )}
      {/* Fallback image */}
      <img
        src={fallbackSrc}
        alt={generateImageAltText(image, siteName)}
        title={generateImageTitle(image, siteName)}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block', // Removes inline spacing
          margin: 0,
          padding: 0,
          verticalAlign: 'top', // Fallback for any remaining inline behavior
          objectFit: 'cover', // Ensures proper aspect ratio
        }}
        onError={handleImageError}
      />
    </picture>
  );
}

// Automatic slideshow component - adapted for TakeOff Info
export function ImageSlideshow({ images }: { images: GalleryImage[] }) {
  // Debug logging
  console.log('🖼️ ImageSlideshow rendered with', images.length, 'images:', images);

  // Use slideshow hook
  const {
    currentIndex,
    setIsPaused,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    getTransitionStyles,
    getItemStyles,
  } = useImageSlideshow(images.length, SLIDESHOW_CONFIG);

  // Track previous index for zoom transition
  const [prevIndex, setPrevIndex] = React.useState(currentIndex);

  React.useEffect(() => {
    if (currentIndex !== prevIndex) {
      setPrevIndex(currentIndex);
    }
  }, [currentIndex, prevIndex]);

  // If no images or only one image, render single image or nothing
  if (images.length <= 1) {
    return images.length === 1 && images[0]
      ? renderImageElement(images[0])
      : null;
  }

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        height: 'auto',
        margin: 0,
        padding: 0,
        lineHeight: 0, // Critical: removes spacing below images
        display: 'block',
        verticalAlign: 'top',
        borderRadius: 1, // Add slight border radius for better appearance
        boxShadow: 1, // Add subtle shadow
      }}
      onMouseEnter={() => SLIDESHOW_CONFIG.pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => SLIDESHOW_CONFIG.pauseOnHover && setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <Box sx={getTransitionStyles()}>
        {/* Reference image for container height - only visible for current image in slide mode */}
        {SLIDESHOW_CONFIG.transitionType === 'slide' &&
          images[currentIndex] && (
            <Box
              sx={{
                visibility: 'hidden',
                width: '100%',
                margin: 0,
                padding: 0,
                lineHeight: 0,
              }}
            >
              {renderImageElement(images[currentIndex])}
            </Box>
          )}

        {images.map((image, index) => {
          if (!image) return null;

          // Base styles for all items
          const baseStyles = {
            minWidth: '100%',
            maxWidth: '100%',
            flexShrink: 0,
            display: 'block',
            boxSizing: 'border-box',
            margin: 0,
            padding: 0,
            lineHeight: 0, // Removes line-height spacing
          };

          // Get item-specific styles based on transition type
          let itemSpecificStyles = {};

          if (SLIDESHOW_CONFIG.transitionType === 'slide') {
            itemSpecificStyles = getItemStyles(index);
          } else if (SLIDESHOW_CONFIG.transitionType === 'zoom') {
            const isCurrentItem = index === currentIndex;
            const isPrevItem =
              index === prevIndex && prevIndex !== currentIndex;

            let scale = '1.2'; // Default: large/hidden
            let opacity = 0; // Default: hidden

            if (isCurrentItem) {
              scale = '1'; // Current image: scales down from 1.2 to 1 (fits container)
              opacity = 1; // Visible
            } else if (isPrevItem) {
              scale = '0.95'; // Previous image: scales down from 1 to 0.95 (gets smaller)
              opacity = 0; // Fading out
            }

            itemSpecificStyles = {
              position: isCurrentItem ? 'relative' : 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              opacity,
              transform: `scale(${scale})`,
              transition: `all ${SLIDESHOW_CONFIG.transitionDuration}ms ${SLIDESHOW_CONFIG.transitionEasing}`,
              transformOrigin: 'center center', // Zoom from center
            };
          }

          return (
            <Box
              key={`${image.path}-${index}`}
              sx={{
                ...baseStyles,
                ...itemSpecificStyles,
              }}
            >
              {renderImageElement(image)}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}