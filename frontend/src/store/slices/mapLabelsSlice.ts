import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { getMapLabels, setMapLabels } from '@utils/preferences';
import type { MapLabelsState } from '@app-types';

// Map labels visibility state slice with localStorage integration

const initialState: MapLabelsState = {
  showLabels: getMapLabels(), // Initialize from localStorage
};

const mapLabelsSlice = createSlice({
  name: 'mapLabels',
  initialState,
  reducers: {
    setMapLabelsAction: (state, action: PayloadAction<boolean>) => {
      state.showLabels = action.payload;
      // Save to localStorage whenever Redux state changes
      setMapLabels(action.payload);
    },
    toggleMapLabelsAction: (state) => {
      state.showLabels = !state.showLabels;
      // Save to localStorage when toggling
      setMapLabels(state.showLabels);
    },
  },
});

export const { setMapLabelsAction, toggleMapLabelsAction } = mapLabelsSlice.actions;
export default mapLabelsSlice.reducer;