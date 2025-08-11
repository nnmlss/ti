import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { FlyingSite } from '../types';

// Sites array slice
const sitesArraySlice = createSlice({
  name: 'sites',
  initialState: [] as FlyingSite[],
  reducers: {
    setSites: (state, action: PayloadAction<FlyingSite[]>) => {
      return action.payload;
    },
    addSite: (state, action: PayloadAction<FlyingSite>) => {
      state.push(action.payload);
    },
    updateSite: (state, action: PayloadAction<FlyingSite>) => {
      const index = state.findIndex((site) => site._id === action.payload._id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    deleteSite: (state, action: PayloadAction<string>) => {
      return state.filter((site) => site._id !== action.payload);
    },
  },
});

// Loading state slice
const loadingSlice = createSlice({
  name: 'loading',
  initialState: false,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      return action.payload;
    },
  },
});

// Error state slice
const errorSlice = createSlice({
  name: 'error',
  initialState: null as string | null,
  reducers: {
    setError: (state, action: PayloadAction<string | null>) => {
      return action.payload;
    },
    clearError: () => {
      return null;
    },
  },
});

// Home view state slice
const homeViewSlice = createSlice({
  name: 'homeView',
  initialState: 'map' as 'map' | 'list',
  reducers: {
    setHomeView: (_state, action: PayloadAction<'map' | 'list'>) => {
      return action.payload;
    },
  },
});

export const { setSites, addSite, updateSite, deleteSite } = sitesArraySlice.actions;
export const { setLoading } = loadingSlice.actions;
export const { setError, clearError } = errorSlice.actions;
export const { setHomeView } = homeViewSlice.actions;

export const sitesReducer = sitesArraySlice.reducer;
export const loadingReducer = loadingSlice.reducer;
export const errorReducer = errorSlice.reducer;
export const homeViewReducer = homeViewSlice.reducer;
