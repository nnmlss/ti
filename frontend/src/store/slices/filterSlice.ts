import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { getWindDirectionFilter, setWindDirectionFilter as saveWindDirectionFilter } from '@utils/preferences';

// Filter state slice with localStorage integration
const filterSlice = createSlice({
  name: 'filter',
  initialState: {
    windDirection: getWindDirectionFilter(), // Initialize from localStorage
  } as { windDirection: string | null },
  reducers: {
    setWindDirectionFilter: (state, action: PayloadAction<string | null>) => {
      // Save to localStorage whenever Redux state changes
      saveWindDirectionFilter(action.payload);
      state.windDirection = action.payload;
    },
    clearFilters: (state) => {
      // Save to localStorage when clearing filters
      saveWindDirectionFilter(null);
      state.windDirection = null;
    },
  },
});

export const { setWindDirectionFilter, clearFilters } = filterSlice.actions;
export const filterReducer = filterSlice.reducer;