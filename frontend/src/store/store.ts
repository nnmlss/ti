import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';
import { sitesReducer, loadingReducer, errorReducer } from './sitesSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    sites: sitesReducer,
    loading: loadingReducer,
    error: errorReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
