import { configureStore } from '@reduxjs/toolkit';
import { sitesReducer, loadingReducer, errorReducer, currentSiteReducer, homeViewReducer, filterReducer } from './sitesSlice';

export const store = configureStore({
  reducer: {
    sites: sitesReducer,
    loading: loadingReducer,
    error: errorReducer,
    currentSite: currentSiteReducer,
    homeView: homeViewReducer,
    filter: filterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
