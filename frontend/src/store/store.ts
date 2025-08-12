import { configureStore } from '@reduxjs/toolkit';
import { allSitesReducer } from './slices/allSitesSlice';
import { singleSiteReducer } from './slices/singleSiteSlice';
import { homeViewReducer } from './slices/homeViewSlice';
import { filterReducer } from './slices/filterSlice';

export const store = configureStore({
  reducer: {
    allSites: allSitesReducer,
    singleSite: singleSiteReducer,
    homeView: homeViewReducer,
    filter: filterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
