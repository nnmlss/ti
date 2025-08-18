import { configureStore } from '@reduxjs/toolkit';
import { allSitesReducer } from './slices/allSitesSlice';
import { singleSiteReducer } from './slices/singleSiteSlice';
import { homeViewReducer } from './slices/homeViewSlice';
import { filterReducer } from './slices/filterSlice';
import { errorNotificationReducer } from './slices/errorNotificationSlice';
// Removed mapTypeReducer - using native LayersControl instead
import mapLabelsReducer from './slices/mapLabelsSlice';
import { errorNotificationMiddleware } from './middleware/errorNotificationMiddleware';

export const store = configureStore({
  reducer: {
    allSites: allSitesReducer,
    singleSite: singleSiteReducer,
    homeView: homeViewReducer,
    filter: filterReducer,
    errorNotification: errorNotificationReducer,
    // mapType removed - using native LayersControl instead
    mapLabels: mapLabelsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(errorNotificationMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
