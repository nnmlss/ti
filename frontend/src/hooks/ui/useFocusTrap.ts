import { useEffect, useRef, useCallback } from 'react';

// Focus Trap Pattern - Traps focus within a container element
export interface FocusTrapOptions {
  autoFocus?: boolean;
  restoreFocus?: boolean;
  initialFocusRef?: React.RefObject<HTMLElement>;
  finalFocusRef?: React.RefObject<HTMLElement>;
}

export const useFocusTrap = (
  isActive: boolean, 
  options: FocusTrapOptions = {}
) => {
  const containerRef = useRef<HTMLElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  
  const {
    autoFocus = true,
    restoreFocus = true,
    initialFocusRef,
    finalFocusRef
  } = options;

  // Get all focusable elements within the container
  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return [];
    
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"]):not([disabled])',
      '[contenteditable="true"]'
    ].join(', ');
    
    return Array.from(containerRef.current.querySelectorAll(focusableSelectors))
      .filter((element) => {
        const htmlElement = element as HTMLElement;
        const style = window.getComputedStyle(htmlElement);
        return style.display !== 'none' && 
               style.visibility !== 'hidden' && 
               !htmlElement.hasAttribute('aria-hidden');
      }) as HTMLElement[];
  }, []);

  // Handle Tab key navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key !== 'Tab' || !isActive) return;
    
    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (event.shiftKey) {
      // Shift + Tab - moving backwards
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      }
    } else {
      // Tab - moving forwards
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    }
  }, [isActive, getFocusableElements]);

  // Set initial focus when trap becomes active
  useEffect(() => {
    if (!isActive) return;
    
    // Store the currently focused element
    previousActiveElement.current = document.activeElement as HTMLElement;
    
    if (autoFocus) {
      // Focus initial element if specified, otherwise focus first focusable element
      const initialElement = initialFocusRef?.current;
      if (initialElement) {
        initialElement.focus();
      } else {
        const focusableElements = getFocusableElements();
        if (focusableElements.length > 0) {
          focusableElements[0]?.focus();
        }
      }
    }
  }, [isActive, autoFocus, initialFocusRef, getFocusableElements]);

  // Restore focus when trap becomes inactive
  useEffect(() => {
    if (isActive) return;
    
    if (restoreFocus && previousActiveElement.current) {
      const elementToFocus = finalFocusRef?.current || previousActiveElement.current;
      
      // Use setTimeout to avoid focus being overridden by other effects
      setTimeout(() => {
        if (elementToFocus && document.contains(elementToFocus)) {
          elementToFocus.focus();
        }
      }, 0);
    }
  }, [isActive, restoreFocus, finalFocusRef]);

  // Add/remove keydown listener
  useEffect(() => {
    if (!isActive) return;
    
    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isActive, handleKeyDown]);

  // Utility functions
  const focusFirst = useCallback(() => {
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0]?.focus();
    }
  }, [getFocusableElements]);

  const focusLast = useCallback(() => {
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[focusableElements.length - 1]?.focus();
    }
  }, [getFocusableElements]);

  const hasFocus = useCallback(() => {
    if (!containerRef.current) return false;
    return containerRef.current.contains(document.activeElement);
  }, []);

  return {
    containerRef,
    focusFirst,
    focusLast,
    hasFocus,
    focusableElements: getFocusableElements(),
  };
};