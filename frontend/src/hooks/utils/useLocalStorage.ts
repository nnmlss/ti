import { useState, useCallback } from 'react';

type StorageStrategy = 'local' | 'session';

export interface LocalStorageHook<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  removeValue: () => void;
  hasValue: boolean;
}

export const useLocalStorage = <T>(
  key: string,
  initialValue: T,
  strategy: StorageStrategy = 'local'
): LocalStorageHook<T> => {
  const storage = strategy === 'local' ? localStorage : sessionStorage;

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = storage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading ${strategy}Storage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        storage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting ${strategy}Storage key "${key}":`, error);
    }
  }, [key, storedValue, storage, strategy]);

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        storage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Error removing ${strategy}Storage key "${key}":`, error);
    }
  }, [key, initialValue, storage, strategy]);

  const hasValue = useCallback(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    
    try {
      return storage.getItem(key) !== null;
    } catch {
      return false;
    }
  }, [key, storage]);

  return {
    value: storedValue,
    setValue,
    removeValue,
    hasValue: hasValue(),
  };
};