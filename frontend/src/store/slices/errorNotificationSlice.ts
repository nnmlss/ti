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
}

const initialState: ErrorNotificationState = {
  open: false,
  message: '',
  title: undefined,
  retryAction: undefined,
  isRetrying: false,
};

const errorNotificationSlice = createSlice({
  name: 'errorNotification',
  initialState,
  reducers: {
    showErrorNotification: (state, action: PayloadAction<{ message: string; title?: string; retryAction?: { type: string; payload?: unknown; onSuccess?: () => void } }>) => {
      state.open = true;
      state.message = action.payload.message;
      state.title = action.payload.title;
      state.retryAction = action.payload.retryAction;
      state.isRetrying = false;
    },
    hideErrorNotification: (state) => {
      state.open = false;
      state.message = '';
      state.title = undefined;
      state.retryAction = undefined;
      state.isRetrying = false;
    },
    setRetrying: (state, action: PayloadAction<boolean>) => {
      state.isRetrying = action.payload;
    },
  },
});

export const { showErrorNotification, hideErrorNotification, setRetrying } = errorNotificationSlice.actions;
export const errorNotificationReducer = errorNotificationSlice.reducer;