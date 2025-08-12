import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

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

export const { setWindDirectionFilter, clearFilters } = filterSlice.actions;
export const filterReducer = filterSlice.reducer;