import { useState, useCallback } from 'react';

/**
 * Hook that provides immediate loading feedback for async operations.
 * Combines local state (for immediate feedback) with optional Redux state (for consistency).
 * 
 * @param options Configuration options
 * @returns Object with execute function and loading state
 * 
 * @example
 * ```typescript
 * const deleteAction = useImmediateAsync({
 *   onError: (error) => showNotification(`Delete failed: ${error.message}`)
 * });
 * 
 * const handleDelete = () => deleteAction.execute(async () => {
 *   await dispatch(deleteSiteThunk(siteId));
 *   onClose();
 * });
 * 
 * <Button disabled={deleteAction.isLoading}>
 *   {deleteAction.isLoading ? <CircularProgress size={20} /> : 'Delete'}
 * </Button>
 * ```
 */

interface UseImmediateAsyncOptions {
  /** Called when the async operation throws an error */
  onError?: (error: Error) => void;
  /** Called when the async operation completes successfully */
  onSuccess?: () => void;
  /** Optional Redux loading state to combine with local state */
  externalLoading?: boolean;
}

interface UseImmediateAsyncReturn {
  /** Execute an async operation with immediate loading feedback */
  execute: (asyncFn: () => Promise<void>) => Promise<void>;
  /** True if the operation is currently running (local + external state) */
  isLoading: boolean;
  /** True if the operation is running (local state only) */
  isLocalLoading: boolean;
  /** Error from the last operation, if any */
  error: Error | null;
  /** Reset the error state */
  clearError: () => void;
}

export const useImmediateAsync = (
  options: UseImmediateAsyncOptions = {}
): UseImmediateAsyncReturn => {
  const { onError, onSuccess, externalLoading = false } = options;
  
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const execute = useCallback(async (asyncFn: () => Promise<void>) => {
    setIsLocalLoading(true); // Immediate feedback
    setError(null); // Clear previous errors
    
    try {
      await asyncFn();
      onSuccess?.();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      onError?.(error);
      // Re-throw so calling code can handle it if needed
      throw error;
    } finally {
      setIsLocalLoading(false);
    }
  }, [onError, onSuccess]);
  
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  return {
    execute,
    isLoading: isLocalLoading || externalLoading,
    isLocalLoading,
    error,
    clearError,
  };
};