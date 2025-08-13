import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface ErrorNotificationState {
  open: boolean;
  message: string;
  title?: string;
}

const initialState: ErrorNotificationState = {
  open: false,
  message: '',
  title: undefined,
};

const errorNotificationSlice = createSlice({
  name: 'errorNotification',
  initialState,
  reducers: {
    showErrorNotification: (state, action: PayloadAction<{ message: string; title?: string }>) => {
      state.open = true;
      state.message = action.payload.message;
      state.title = action.payload.title;
    },
    hideErrorNotification: (state) => {
      state.open = false;
      state.message = '';
      state.title = undefined;
    },
  },
});

export const { showErrorNotification, hideErrorNotification } = errorNotificationSlice.actions;
export const errorNotificationReducer = errorNotificationSlice.reducer;