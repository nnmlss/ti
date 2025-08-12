import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { FlyingSite } from '../../types';
import {
  loadSingleSiteThunk,
  addSiteThunk,
  updateSiteThunk,
  deleteSiteThunk,
} from '../thunks/sitesThunks';

// Define async state type
type AsyncState = {
  status: 'idle' | 'pending' | 'success' | 'error';
  error: string | null;
};

type SingleSiteState = {
  data: FlyingSite | null;
  load: AsyncState;
  edit: AsyncState; // Used for both add and update operations
  delete: AsyncState;
};

const initialAsyncState: AsyncState = {
  status: 'idle',
  error: null,
};

const initialState: SingleSiteState = {
  data: null,
  load: { ...initialAsyncState },
  edit: { ...initialAsyncState },
  delete: { ...initialAsyncState },
};

// Single site slice with granular operation states
const singleSiteSlice = createSlice({
  name: 'singleSite',
  initialState,
  reducers: {
    // Manual data management
    setCurrentSite: (state, action: PayloadAction<FlyingSite | null>) => {
      state.data = action.payload;
    },
    clearCurrentSite: (state) => {
      state.data = null;
    },
    // Reset operation states
    resetLoadState: (state) => {
      state.load = { ...initialAsyncState };
    },
    resetEditState: (state) => {
      state.edit = { ...initialAsyncState };
    },
    resetDeleteState: (state) => {
      state.delete = { ...initialAsyncState };
    },
    // Reset all operation states
    resetAllStates: (state) => {
      state.load = { ...initialAsyncState };
      state.edit = { ...initialAsyncState };
      state.delete = { ...initialAsyncState };
    },
  },
  extraReducers: (builder) => {
    builder
      // Load single site
      .addCase(loadSingleSiteThunk.pending, (state) => {
        state.load = { status: 'pending', error: null };
      })
      .addCase(loadSingleSiteThunk.fulfilled, (state, action) => {
        state.data = action.payload;
        state.load = { status: 'success', error: null };
      })
      .addCase(loadSingleSiteThunk.rejected, (state, action) => {
        state.load = { 
          status: 'error', 
          error: action.error.message || 'Failed to load site' 
        };
      })
      
      // Add site (create new)
      .addCase(addSiteThunk.pending, (state) => {
        state.edit = { status: 'pending', error: null };
      })
      .addCase(addSiteThunk.fulfilled, (state, action) => {
        state.data = action.payload;
        state.edit = { status: 'success', error: null };
      })
      .addCase(addSiteThunk.rejected, (state, action) => {
        state.edit = { 
          status: 'error', 
          error: action.error.message || 'Failed to create site' 
        };
      })
      
      // Update site
      .addCase(updateSiteThunk.pending, (state) => {
        state.edit = { status: 'pending', error: null };
      })
      .addCase(updateSiteThunk.fulfilled, (state, action) => {
        state.data = action.payload;
        state.edit = { status: 'success', error: null };
      })
      .addCase(updateSiteThunk.rejected, (state, action) => {
        state.edit = { 
          status: 'error', 
          error: action.error.message || 'Failed to update site' 
        };
      })
      
      // Delete site
      .addCase(deleteSiteThunk.pending, (state) => {
        state.delete = { status: 'pending', error: null };
      })
      .addCase(deleteSiteThunk.fulfilled, (state) => {
        state.data = null; // Clear the current site after successful deletion
        state.delete = { status: 'success', error: null };
      })
      .addCase(deleteSiteThunk.rejected, (state, action) => {
        state.delete = { 
          status: 'error', 
          error: action.error.message || 'Failed to delete site' 
        };
      });
  },
});

export const {
  setCurrentSite,
  clearCurrentSite,
  resetLoadState,
  resetEditState,
  resetDeleteState,
  resetAllStates,
} = singleSiteSlice.actions;

export const singleSiteReducer = singleSiteSlice.reducer;

// Selectors for easy access
export const selectCurrentSite = (state: { singleSite: SingleSiteState }) => state.singleSite.data;
export const selectSiteLoadState = (state: { singleSite: SingleSiteState }) => state.singleSite.load;
export const selectSiteEditState = (state: { singleSite: SingleSiteState }) => state.singleSite.edit;
export const selectSiteDeleteState = (state: { singleSite: SingleSiteState }) => state.singleSite.delete;