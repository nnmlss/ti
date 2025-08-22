import type { Middleware } from '@reduxjs/toolkit';
import { showErrorNotification, enableServerError } from '@store/slices/errorNotificationSlice';
import { isHandledByCallback } from '@store/utils/thunkWithCallback';
import { getLocalizedOperationName, getLocalizedErrorMessage } from '@store/utils/errorMessages';
import { diagnoseConnectivityIssue } from '@utils/networkCheck';

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

      // Check for 503/404 errors - always trigger server error mode
      if (rawErrorMessage.includes('503') || rawErrorMessage.includes('Code: 503') ||
          rawErrorMessage.includes('404') || rawErrorMessage.includes('Code: 404')) {
        store.dispatch(enableServerError());
        return result;
      }

      // Check for 500 errors - diagnose the issue first
      if (rawErrorMessage.includes('500') || rawErrorMessage.includes('Code: 500')) {
        // Perform network diagnosis asynchronously
        diagnoseConnectivityIssue().then((issueType) => {
          const operationName = getLocalizedOperationName(originalActionType);
          
          if (issueType === 'network') {
            // User has no internet connection - show network error
            store.dispatch(
              showErrorNotification({
                title: `${operationName} се провали`,
                message: 'Няма интернет връзка. Моля, проверете мрежовата си връзка.',
                retryAction: {
                  type: originalActionType,
                  payload,
                },
              })
            );
          } else if (issueType === 'server') {
            // Server is unreachable - show server error
            store.dispatch(
              showErrorNotification({
                title: `${operationName} се провали`,
                message: 'Сървърът не отговаря. Възможно е да има техническа поддръжка.',
                retryAction: {
                  type: originalActionType,
                  payload,
                },
              })
            );
          } else {
            // Server responds but returns 500 - server error mode
            store.dispatch(enableServerError());
          }
        }).catch(() => {
          // If diagnosis fails, show generic server error
          const operationName = getLocalizedOperationName(originalActionType);
          store.dispatch(
            showErrorNotification({
              title: `${operationName} се провали`,
              message: 'Възникна грешка в сървъра',
              retryAction: {
                type: originalActionType,
                payload,
              },
            })
          );
        });
        
        return result; // Exit early, async handling will dispatch appropriate action
      }

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
