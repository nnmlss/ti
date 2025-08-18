import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

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
  isMaintenanceMode: boolean;
}

const initialState: ErrorNotificationState = {
  open: false,
  message: '',
  isRetrying: false,
  isMaintenanceMode: false,
};

const errorNotificationSlice = createSlice({
  name: 'errorNotification',
  initialState,
  reducers: {
    showErrorNotification: (state, action: PayloadAction<{ message: string; title?: string; retryAction?: { type: string; payload?: unknown; onSuccess?: () => void } }>) => {
      state.open = true;
      state.message = action.payload.message;
      if (action.payload.title !== undefined) {
        state.title = action.payload.title;
      }
      if (action.payload.retryAction !== undefined) {
        state.retryAction = action.payload.retryAction;
      }
      state.isRetrying = false;
    },
    hideErrorNotification: (state) => {
      state.open = false;
      state.message = '';
      delete state.title;
      delete state.retryAction;
      state.isRetrying = false;
    },
    setRetrying: (state, action: PayloadAction<boolean>) => {
      state.isRetrying = action.payload;
    },
    enableMaintenanceMode: (state) => {
      state.isMaintenanceMode = true;
    },
    disableMaintenanceMode: (state) => {
      state.isMaintenanceMode = false;
    },
  },
});

export const { showErrorNotification, hideErrorNotification, setRetrying, enableMaintenanceMode, disableMaintenanceMode } = errorNotificationSlice.actions;
export const errorNotificationReducer = errorNotificationSlice.reducer;