import { useState, useCallback } from 'react';
import type { UseImmediateAsyncOptions, UseImmediateAsyncReturn } from '@app-types';

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