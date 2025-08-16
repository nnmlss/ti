import type { Middleware } from '@reduxjs/toolkit';
import { showErrorNotification } from '@store/slices/errorNotificationSlice';
import { isHandledByCallback } from '@store/utils/thunkWithCallback';
import { getLocalizedOperationName, getLocalizedErrorMessage } from '@store/utils/errorMessages';

interface RejectedAction {
  type: string;
  payload?: string;
  error?: { message?: string };
  meta?: {
    arg?: unknown;
    requestId?: string;
    rejectedWithValue?: boolean;
  };
}

// Middleware to automatically show error notifications when thunks are rejected
export const errorNotificationMiddleware: Middleware =
  (store) => (next) => (action: unknown) => {
    const result = next(action);

    // Type guard to check if action has the expected properties
    const rejectedAction = action as RejectedAction;

    // Check if action is a rejected thunk
    if (rejectedAction.type && rejectedAction.type.endsWith('/rejected')) {
      const originalActionType = rejectedAction.type.replace('/rejected', '');
      const payload = rejectedAction.meta?.arg;

      // Skip if this operation is being handled by callback utility
      if (isHandledByCallback(originalActionType, payload)) {
        return result;
      }

      const rawErrorMessage =
        rejectedAction.payload ||
        rejectedAction.error?.message ||
        'An unexpected error occurred';

      // Get localized Bulgarian messages
      const operationName = getLocalizedOperationName(originalActionType);
      const errorMessage = getLocalizedErrorMessage(rawErrorMessage);

      // Create retry action from the original failed action
      const retryAction = {
        type: originalActionType,
        payload,
      };

      store.dispatch(
        showErrorNotification({
          title: `${operationName} се провали`,
          message: errorMessage,
          retryAction,
        })
      );
    }

    return result;
  };
