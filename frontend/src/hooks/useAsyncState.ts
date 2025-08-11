import { useState, useCallback } from 'react';

// State Machine Pattern - Defines all possible states and transitions
export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  error: string | null;
  status: AsyncStatus;
  isIdle: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

export interface AsyncActions<T> {
  execute: (asyncFn: () => Promise<T>) => Promise<void>;
  reset: () => void;
  setData: (data: T) => void;
  setError: (error: string) => void;
}

export interface AsyncStateHook<T> extends AsyncState<T>, AsyncActions<T> {}

const createInitialState = <T>(): AsyncState<T> => ({
  data: null,
  error: null,
  status: 'idle',
  isIdle: true,
  isLoading: false,
  isSuccess: false,
  isError: false,
});

const createStateFromStatus = <T>(
  status: AsyncStatus,
  data: T | null = null,
  error: string | null = null
): AsyncState<T> => ({
  data,
  error,
  status,
  isIdle: status === 'idle',
  isLoading: status === 'loading',
  isSuccess: status === 'success',
  isError: status === 'error',
});

export const useAsyncState = <T = any>(
  initialData: T | null = null
): AsyncStateHook<T> => {
  const [state, setState] = useState<AsyncState<T>>(() => {
    if (initialData) {
      return createStateFromStatus('success', initialData);
    }
    return createInitialState<T>();
  });

  const execute = useCallback(async (asyncFn: () => Promise<T>) => {
    setState(createStateFromStatus('loading'));
    
    try {
      const data = await asyncFn();
      setState(createStateFromStatus('success', data));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setState(createStateFromStatus('error', null, errorMessage));
    }
  }, []);

  const reset = useCallback(() => {
    setState(createInitialState<T>());
  }, []);

  const setData = useCallback((data: T) => {
    setState(createStateFromStatus('success', data));
  }, []);

  const setError = useCallback((error: string) => {
    setState(createStateFromStatus('error', null, error));
  }, []);

  return {
    ...state,
    execute,
    reset,
    setData,
    setError,
  };
};