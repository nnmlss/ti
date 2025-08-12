import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { FlyingSite } from '../types';
import { loadSingleSiteThunk, loadSitesThunk, addSiteThunk, updateSiteThunk, deleteSiteThunk } from './sitesThunk';

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
  extraReducers: (builder) => {
    builder
      // Load sites
      .addCase(loadSitesThunk.fulfilled, (state, action) => {
        return action.payload;
      })
      // Add site
      .addCase(addSiteThunk.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      // Update site
      .addCase(updateSiteThunk.fulfilled, (state, action) => {
        const index = state.findIndex((site) => site._id === action.payload._id);
        if (index !== -1) {
          state[index] = action.payload;
        }
      })
      // Delete site
      .addCase(deleteSiteThunk.fulfilled, (state, action) => {
        return state.filter((site) => site._id !== action.payload);
      });
  },
});

// Loading state slice
const loadingSlice = createSlice({
  name: 'loading',
  initialState: {
    general: false,
    singleSite: false,
    adding: false,
    updating: false,
    deleting: false,
  },
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.general = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load single site loading states
      .addCase(loadSingleSiteThunk.pending, (state) => {
        state.singleSite = true;
      })
      .addCase(loadSingleSiteThunk.fulfilled, (state) => {
        state.singleSite = false;
      })
      .addCase(loadSingleSiteThunk.rejected, (state) => {
        state.singleSite = false;
      })
      // Load sites loading states
      .addCase(loadSitesThunk.pending, (state) => {
        state.general = true;
      })
      .addCase(loadSitesThunk.fulfilled, (state) => {
        state.general = false;
      })
      .addCase(loadSitesThunk.rejected, (state) => {
        state.general = false;
      })
      // Add site loading states
      .addCase(addSiteThunk.pending, (state) => {
        state.adding = true;
      })
      .addCase(addSiteThunk.fulfilled, (state) => {
        state.adding = false;
      })
      .addCase(addSiteThunk.rejected, (state) => {
        state.adding = false;
      })
      // Update site loading states
      .addCase(updateSiteThunk.pending, (state) => {
        state.updating = true;
      })
      .addCase(updateSiteThunk.fulfilled, (state) => {
        state.updating = false;
      })
      .addCase(updateSiteThunk.rejected, (state) => {
        state.updating = false;
      })
      // Delete site loading states
      .addCase(deleteSiteThunk.pending, (state) => {
        state.deleting = true;
      })
      .addCase(deleteSiteThunk.fulfilled, (state) => {
        state.deleting = false;
      })
      .addCase(deleteSiteThunk.rejected, (state) => {
        state.deleting = false;
      });
  },
});

// Error state slice
const errorSlice = createSlice({
  name: 'error',
  initialState: null as string | null,
  reducers: {
    setError: (_state, action: PayloadAction<string | null>) => {
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

// Current site slice (for edit/view operations)
const currentSiteSlice = createSlice({
  name: 'currentSite',
  initialState: null as FlyingSite | null,
  reducers: {
    setCurrentSite: (state, action: PayloadAction<FlyingSite | null>) => {
      return action.payload;
    },
    clearCurrentSite: () => {
      return null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadSingleSiteThunk.fulfilled, (state, action) => {
        return action.payload;
      });
  },
});

// Filter state slice
const filterSlice = createSlice({
  name: 'filter',
  initialState: {
    windDirection: null,
  } as { windDirection: string | null },
  reducers: {
    setWindDirectionFilter: (state, action: PayloadAction<string | null>) => {
      state.windDirection = action.payload;
    },
    clearFilters: (state) => {
      state.windDirection = null;
    },
  },
});

export const { setSites, addSite, updateSite, deleteSite } = sitesArraySlice.actions;
export const { setLoading } = loadingSlice.actions;
export const { setError, clearError } = errorSlice.actions;
export const { setCurrentSite, clearCurrentSite } = currentSiteSlice.actions;
export const { setHomeView } = homeViewSlice.actions;
export const { setWindDirectionFilter, clearFilters } = filterSlice.actions;

export const sitesReducer = sitesArraySlice.reducer;
export const loadingReducer = loadingSlice.reducer;
export const errorReducer = errorSlice.reducer;
export const currentSiteReducer = currentSiteSlice.reducer;
export const homeViewReducer = homeViewSlice.reducer;
export const filterReducer = filterSlice.reducer;
