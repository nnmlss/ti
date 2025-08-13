import type { AppDispatch } from '../store';

interface ThunkWithCallbackOptions {
  thunkAction: unknown; // RTK thunk
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

/**
 * Utility to dispatch thunks with success/error callbacks that survive the retry process
 */
export const dispatchThunkWithCallback = async (
  dispatch: AppDispatch,
  options: ThunkWithCallbackOptions
) => {
  const { thunkAction, onSuccess, onError } = options;
  
  try {
    await dispatch(thunkAction).unwrap();
    // Success - execute callback
    if (onSuccess) {
      onSuccess();
    }
  } catch (error) {
    // Let the error middleware handle this - don't create duplicate error notifications
    console.log('Form submission failed, error middleware will handle retry');
    // Execute error callback if provided
    if (onError) {
      const errorMessage = typeof error === 'string' ? error : 'An unexpected error occurred';
      onError(errorMessage);
    }
  }
};

/**
 * Check if an operation is currently being handled by callback utility
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const isHandledByCallback = (_actionType: string, _payload: unknown): boolean => {
  // No longer needed since we're using global callback approach, but keep parameters for compatibility
  return false;
};