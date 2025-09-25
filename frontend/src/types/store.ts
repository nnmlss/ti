// ===== STORE TYPES =====
import type { AsyncThunkAction } from '@reduxjs/toolkit';

// Error Notification Slice Types
export interface ErrorNotificationState {
  open: boolean;
  message: string;
  title?: string;
  retryAction?: {
    type: string;
    payload?: unknown;
    onSuccess?: () => void;
  };
  isRetrying: boolean;
  isServerError: boolean;
}

// Map Labels Slice Types
export interface MapLabelsState {
  showLabels: boolean;
}

// Error Notification Middleware Types
export interface RejectedAction {
  type: string;
  payload?: string;
  error?: { message?: string };
  meta?: {
    arg?: unknown;
    requestId?: string;
    rejectedWithValue?: boolean;
  };
}

// Image Thunks Types
export interface ImageUploadResponse {
  message: string;
  image: {
    path: string;
    originalName: string;
    mimetype: string;
    size: number;
    width?: number;
    height?: number;
    format?: string;
  };
}

export interface ImageDeleteResponse {
  message: string;
  filename: string;
}

// Thunk Utility Types
export interface ThunkWithCallbackOptions {
  thunkAction: AsyncThunkAction<unknown, unknown, object>;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}