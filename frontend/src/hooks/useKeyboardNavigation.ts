import { useEffect, useCallback, useRef } from 'react';

export interface KeyboardNavigationOptions {
  onEscape?: () => void;
  onEnter?: () => void;
  onSpace?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onHome?: () => void;
  onEnd?: () => void;
  enableArrowKeys?: boolean;
  preventDefault?: boolean;
  stopPropagation?: boolean;
}

// Keyboard Navigation Pattern - Handles keyboard interactions for accessibility
export const useKeyboardNavigation = (
  isActive: boolean,
  options: KeyboardNavigationOptions = {}
) => {
  const {
    enableArrowKeys = false,
    preventDefault = true,
    stopPropagation = true,
  } = options;

  const handlersRef = useRef(options);
  handlersRef.current = options;

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isActive) return;

    const { key, ctrlKey, metaKey, altKey } = event;
    const handlers = handlersRef.current;
    let handled = false;

    // Don't handle keys with modifiers (except Escape)
    if ((ctrlKey || metaKey || altKey) && key !== 'Escape') return;

    switch (key) {
      case 'Escape':
        if (handlers.onEscape) {
          handlers.onEscape();
          handled = true;
        }
        break;

      case 'Enter':
        if (handlers.onEnter) {
          handlers.onEnter();
          handled = true;
        }
        break;

      case ' ':
      case 'Space':
        if (handlers.onSpace) {
          handlers.onSpace();
          handled = true;
        }
        break;

      case 'ArrowUp':
        if (enableArrowKeys && handlers.onArrowUp) {
          handlers.onArrowUp();
          handled = true;
        }
        break;

      case 'ArrowDown':
        if (enableArrowKeys && handlers.onArrowDown) {
          handlers.onArrowDown();
          handled = true;
        }
        break;

      case 'ArrowLeft':
        if (enableArrowKeys && handlers.onArrowLeft) {
          handlers.onArrowLeft();
          handled = true;
        }
        break;

      case 'ArrowRight':
        if (enableArrowKeys && handlers.onArrowRight) {
          handlers.onArrowRight();
          handled = true;
        }
        break;

      case 'Home':
        if (handlers.onHome) {
          handlers.onHome();
          handled = true;
        }
        break;

      case 'End':
        if (handlers.onEnd) {
          handlers.onEnd();
          handled = true;
        }
        break;
    }

    if (handled) {
      if (preventDefault) {
        event.preventDefault();
      }
      if (stopPropagation) {
        event.stopPropagation();
      }
    }
  }, [isActive, enableArrowKeys, preventDefault, stopPropagation]);

  // Add/remove event listener
  useEffect(() => {
    if (!isActive) return;

    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isActive, handleKeyDown]);

  // Utility functions for common keyboard patterns
  const createModalKeyHandler = useCallback((onClose: () => void) => {
    return {
      onEscape: onClose,
    };
  }, []);

  const createMenuKeyHandler = useCallback((
    onClose: () => void,
    onNext: () => void,
    onPrevious: () => void,
    onSelect: () => void
  ) => {
    return {
      onEscape: onClose,
      onArrowDown: onNext,
      onArrowUp: onPrevious,
      onEnter: onSelect,
      onSpace: onSelect,
      enableArrowKeys: true,
    };
  }, []);

  const createTabKeyHandler = useCallback((
    onNext: () => void,
    onPrevious: () => void
  ) => {
    return (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          onPrevious();
        } else {
          onNext();
        }
        event.preventDefault();
      }
    };
  }, []);

  return {
    handleKeyDown,
    createModalKeyHandler,
    createMenuKeyHandler,
    createTabKeyHandler,
  };
};