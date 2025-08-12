import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { FlyingSite } from '../../types';
import {
  loadSitesThunk,
  addSiteThunk,
  updateSiteThunk,
  deleteSiteThunk,
} from '../thunks/sitesThunks';

// Define async state type
type AsyncState = {
  status: 'idle' | 'pending' | 'success' | 'error';
  error: string | null;
};

type AllSitesState = {
  data: FlyingSite[];
  load: AsyncState;
};

const initialState: AllSitesState = {
  data: [],
  load: {
    status: 'idle',
    error: null,
  },
};

// All sites slice with integrated loading state
const allSitesSlice = createSlice({
  name: 'allSites',
  initialState,
  reducers: {
    // Manual actions for local state management
    addSiteLocally: (state, action: PayloadAction<FlyingSite>) => {
      state.data.push(action.payload);
    },
    updateSiteLocally: (state, action: PayloadAction<FlyingSite>) => {
      const index = state.data.findIndex((site) => site._id === action.payload._id);
      if (index !== -1) {
        state.data[index] = action.payload;
      }
    },
    deleteSiteLocally: (state, action: PayloadAction<number>) => {
      state.data = state.data.filter((site) => site._id !== action.payload);
    },
    // Reset load state
    resetLoadState: (state) => {
      state.load = { status: 'idle', error: null };
    },
  },
  extraReducers: (builder) => {
    builder
      // Load sites
      .addCase(loadSitesThunk.pending, (state) => {
        state.load = { status: 'pending', error: null };
      })
      .addCase(loadSitesThunk.fulfilled, (state, action) => {
        state.data = action.payload;
        state.load = { status: 'success', error: null };
      })
      .addCase(loadSitesThunk.rejected, (state, action) => {
        state.load = {
          status: 'error',
          error: action.error.message || 'Failed to load sites',
        };
      })
      // Add site - optimistically update the list
      .addCase(addSiteThunk.fulfilled, (state, action) => {
        // Only add if not already in the list (avoid duplicates)
        const exists = state.data.find((site) => site._id === action.payload._id);
        if (!exists) {
          state.data.push(action.payload);
        }
      })
      // Update site - update in the list
      .addCase(updateSiteThunk.fulfilled, (state, action) => {
        const index = state.data.findIndex((site) => site._id === action.payload._id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      // Delete site - remove from list
      .addCase(deleteSiteThunk.fulfilled, (state, action) => {
        state.data = state.data.filter((site) => site._id !== action.payload);
      });
  },
});

export const { addSiteLocally, updateSiteLocally, deleteSiteLocally, resetLoadState } =
  allSitesSlice.actions;
export const allSitesReducer = allSitesSlice.reducer;

// Selectors for easy access
export const selectAllSites = (state: { allSites: AllSitesState }) => state.allSites.data;
export const selectAllSitesLoadState = (state: { allSites: AllSitesState }) =>
  state.allSites.load;
