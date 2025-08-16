import { useCallback, useRef, useEffect } from 'react';

// Observer Pattern - Manages focus state and notifications across the application
export interface FocusState {
  activeElement: HTMLElement | null;
  previousElement: HTMLElement | null;
  focusHistory: HTMLElement[];
  isTrapped: boolean;
  modalCount: number;
}

type FocusListener = (state: FocusState) => void;

class FocusManager {
  private static instance: FocusManager;
  private listeners: Set<FocusListener> = new Set();
  private state: FocusState = {
    activeElement: null,
    previousElement: null,
    focusHistory: [],
    isTrapped: false,
    modalCount: 0,
  };

  static getInstance(): FocusManager {
    if (!FocusManager.instance) {
      FocusManager.instance = new FocusManager();
    }
    return FocusManager.instance;
  }

  private constructor() {
    this.initializeFocusTracking();
  }

  private initializeFocusTracking() {
    // Track focus changes globally
    const handleFocusChange = () => {
      const newActiveElement = document.activeElement as HTMLElement | null;
      
      if (newActiveElement !== this.state.activeElement) {
        this.updateState({
          previousElement: this.state.activeElement,
          activeElement: newActiveElement,
          focusHistory: [
            ...this.state.focusHistory.slice(-9), // Keep last 10 elements
            ...(newActiveElement ? [newActiveElement] : [])
          ]
        });
      }
    };

    document.addEventListener('focusin', handleFocusChange, true);
    document.addEventListener('focusout', handleFocusChange, true);
    
    // Initial state
    this.updateState({
      activeElement: document.activeElement as HTMLElement | null
    });
  }

  private updateState(updates: Partial<FocusState>) {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }

  // Public methods
  subscribe(listener: FocusListener): () => void {
    this.listeners.add(listener);
    // Immediately notify new subscriber of current state
    listener(this.state);
    
    return () => {
      this.listeners.delete(listener);
    };
  }

  getState(): FocusState {
    return { ...this.state };
  }

  setTrapped(trapped: boolean) {
    this.updateState({ isTrapped: trapped });
  }

  incrementModalCount() {
    this.updateState({ 
      modalCount: this.state.modalCount + 1,
      isTrapped: this.state.modalCount + 1 > 0 
    });
  }

  decrementModalCount() {
    const newCount = Math.max(0, this.state.modalCount - 1);
    this.updateState({ 
      modalCount: newCount,
      isTrapped: newCount > 0 
    });
  }

  restorePreviousFocus() {
    const elementToRestore = this.state.previousElement;
    if (elementToRestore && document.contains(elementToRestore)) {
      elementToRestore.focus();
    }
  }

  restoreFromHistory(stepsBack: number = 1) {
    const historyIndex = this.state.focusHistory.length - 1 - stepsBack;
    const elementToRestore = this.state.focusHistory[historyIndex];
    
    if (elementToRestore && document.contains(elementToRestore)) {
      elementToRestore.focus();
    }
  }

  isElementInModal(element: HTMLElement): boolean {
    return element.closest('[role="dialog"], [aria-modal="true"]') !== null;
  }

  getModalStack(): HTMLElement[] {
    return Array.from(document.querySelectorAll('[role="dialog"][aria-modal="true"]')) as HTMLElement[];
  }
}

// Hook implementation
export const useFocusManagement = () => {
  const manager = useRef(FocusManager.getInstance());
  const stateRef = useRef<FocusState>(manager.current.getState());

  // Subscribe to focus state changes
  useEffect(() => {
    const unsubscribe = manager.current.subscribe((newState) => {
      stateRef.current = newState;
    });

    return unsubscribe;
  }, []);

  // Memoized methods to prevent unnecessary re-renders
  const setTrapped = useCallback((trapped: boolean) => {
    manager.current.setTrapped(trapped);
  }, []);

  const incrementModalCount = useCallback(() => {
    manager.current.incrementModalCount();
  }, []);

  const decrementModalCount = useCallback(() => {
    manager.current.decrementModalCount();
  }, []);

  const restorePreviousFocus = useCallback(() => {
    manager.current.restorePreviousFocus();
  }, []);

  const restoreFromHistory = useCallback((stepsBack: number = 1) => {
    manager.current.restoreFromHistory(stepsBack);
  }, []);

  const isElementInModal = useCallback((element: HTMLElement) => {
    return manager.current.isElementInModal(element);
  }, []);

  const getModalStack = useCallback(() => {
    return manager.current.getModalStack();
  }, []);

  const getCurrentState = useCallback(() => {
    return manager.current.getState();
  }, []);

  return {
    // State
    focusState: stateRef.current,
    
    // Actions
    setTrapped,
    incrementModalCount,
    decrementModalCount,
    restorePreviousFocus,
    restoreFromHistory,
    
    // Queries
    isElementInModal,
    getModalStack,
    getCurrentState,
  };
};