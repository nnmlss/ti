import React from 'react';
import type { SlideshowConfig, ImageSlideshowHookResult } from '@app-types';

// Default slideshow configuration - adapted from geomanch
const DEFAULT_SLIDESHOW_CONFIG: SlideshowConfig = {
  autoPlayInterval: 5500, // 5.5 seconds
  transitionDuration: 960, // 0.96 seconds
  transitionEasing: 'ease-in-out', // CSS easing
  transitionType: 'zoom', // 'slide', 'fade', 'zoom' - default to zoom for TakeOff Info
  pauseOnHover: true,
  enableDrag: true, // Enable drag/swipe on mobile
  minSwipeDistance: 50,
};

export function useImageSlideshow(
  imagesLength: number,
  config: Partial<SlideshowConfig> = {}
): ImageSlideshowHookResult {
  const slideshowConfig = { ...DEFAULT_SLIDESHOW_CONFIG, ...config };

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const [touchStart, setTouchStart] = React.useState<number | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null);

  // Auto-play functionality - simple
  React.useEffect(() => {
    if (imagesLength <= 1 || isPaused) return;

    const interval = setInterval(() => {
      if (slideshowConfig.transitionType === 'slide') {
        // For slide: trigger transition first, then change index
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % imagesLength);
          setIsTransitioning(false);
        }, slideshowConfig.transitionDuration);
      } else {
        // For fade/zoom: direct index change
        setCurrentIndex((prev) => (prev + 1) % imagesLength);
      }
    }, slideshowConfig.autoPlayInterval);

    return () => clearInterval(interval);
  }, [imagesLength, isPaused, slideshowConfig.autoPlayInterval, slideshowConfig.transitionType, slideshowConfig.transitionDuration]);

  // Handle index wrapping for infinite loop
  React.useEffect(() => {
    if (currentIndex >= imagesLength) {
      setCurrentIndex(0);
    } else if (currentIndex < 0) {
      setCurrentIndex(imagesLength - 1);
    }
  }, [currentIndex, imagesLength]);

  // Get position and transition state for each item
  const getItemStyles = (itemIndex: number) => {
    const nextIndex = (currentIndex + 1) % imagesLength;
    const isCurrentItem = itemIndex === currentIndex;
    const isNextItem = itemIndex === nextIndex;

    if (slideshowConfig.transitionType === 'slide') {
      // Infinite slide carousel logic:
      // - Current image: x=0 (on stage)
      // - All others: x=100% (off-screen right)
      // - During transition: current slides to x=-100%, next slides from x=100% to x=0

      let transform = 'translate3d(100%, 0, 0)'; // Default: off-screen right (GPU accelerated)

      if (isCurrentItem) {
        // Current image: on stage, or sliding left during transition
        transform = isTransitioning ? 'translate3d(-100%, 0, 0)' : 'translate3d(0, 0, 0)';
      } else if (isNextItem && isTransitioning) {
        // Next image: slides from right to center during transition
        transform = 'translate3d(0, 0, 0)';
      }

      return {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        transform,
        transition: isTransitioning
          ? `transform ${slideshowConfig.transitionDuration}ms ${slideshowConfig.transitionEasing}`
          : 'none',
        width: '100%',
        height: '100%',
        zIndex: isCurrentItem || isNextItem ? 2 : 1,
      };
    } else {
      // For fade/zoom transitions: simple positioning, no z-index management
      return {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        transform: 'translateX(0)',
        transition: 'none',
        width: '100%',
        height: '100%',
        zIndex: 1,
      };
    }
  };

  // Touch/drag handlers - preserved from geomanch
  const onTouchStart = (e: React.TouchEvent) => {
    if (!slideshowConfig.enableDrag) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0]?.clientX || 0);
    setIsPaused(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!slideshowConfig.enableDrag) return;
    setTouchEnd(e.targetTouches[0]?.clientX || 0);
  };

  const onTouchEnd = () => {
    if (!slideshowConfig.enableDrag || !touchStart || !touchEnd || isTransitioning) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > slideshowConfig.minSwipeDistance;
    const isRightSwipe = distance < -slideshowConfig.minSwipeDistance;

    if (isLeftSwipe || isRightSwipe) {
      setIsTransitioning(true);

      setTimeout(() => {
        if (isLeftSwipe) {
          setCurrentIndex((prev) => prev + 1);
        }
        if (isRightSwipe) {
          setCurrentIndex((prev) => prev - 1);
        }
        setIsTransitioning(false);
      }, slideshowConfig.transitionDuration);
    }

    setTimeout(() => setIsPaused(false), 1000); // Resume after 1 second
  };

  // Transition styles based on type - preserved from geomanch
  const getTransitionStyles = () => {
    const duration = `${slideshowConfig.transitionDuration}ms`;
    const easing = slideshowConfig.transitionEasing;

    switch (slideshowConfig.transitionType) {
      case 'fade':
        return {
          position: 'relative',
          minHeight: 'auto',
          '& > *': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            opacity: 0,
            transition: `opacity ${duration} ${easing}`,
            [`&:nth-of-type(${currentIndex + 1})`]: {
              opacity: 1,
            },
          },
          [`& > *:nth-of-type(${currentIndex + 1})`]: {
            position: 'relative',
          },
        };
      case 'zoom':
        return {
          position: 'relative',
          width: '100%',
          height: 'auto',
          overflow: 'hidden',
          margin: 0,
          padding: 0,
          lineHeight: 0,
          display: 'block',
        };
      default: // slide
        return {
          position: 'relative',
          width: '100%',
          height: 'auto',
          overflow: 'hidden',
          margin: 0,
          padding: 0,
          lineHeight: 0,
          display: 'block',
        };
    }
  };

  return {
    currentIndex,
    isPaused,
    isTransitioning,
    touchStart,
    touchEnd,
    setCurrentIndex,
    setIsPaused,
    setIsTransitioning,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    getTransitionStyles,
    getItemStyles,
  };
}