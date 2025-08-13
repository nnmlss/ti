import type { Middleware } from '@reduxjs/toolkit';
import { showErrorNotification } from '../slices/errorNotificationSlice';

interface RejectedAction {
  type: string;
  payload?: string;
  error?: { message?: string };
  meta?: {
    arg?: any;
    requestId?: string;
    rejectedWithValue?: boolean;
  };
}

// Middleware to automatically show error notifications when thunks are rejected
export const errorNotificationMiddleware: Middleware = (store) => (next) => (action: unknown) => {
  const result = next(action);

  // Type guard to check if action has the expected properties
  const rejectedAction = action as RejectedAction;
  
  // Check if action is a rejected thunk
  if (rejectedAction.type && rejectedAction.type.endsWith('/rejected')) {
    const errorMessage = rejectedAction.payload || rejectedAction.error?.message || 'An unexpected error occurred';
    
    // Extract operation name from action type (e.g., 'sites/loadSites/rejected' -> 'Load Sites')
    const operationName = rejectedAction.type
      .replace('/rejected', '')
      .split('/')
      .pop()
      ?.replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str: string) => str.toUpperCase())
      .trim() || 'Operation';

    // Create retry action from the original failed action
    const originalActionType = rejectedAction.type.replace('/rejected', '');
    const retryAction = {
      type: originalActionType,
      payload: rejectedAction.meta?.arg
    };

    store.dispatch(showErrorNotification({
      title: `${operationName} Failed`,
      message: errorMessage,
      retryAction
    }));
  }

  return result;
};