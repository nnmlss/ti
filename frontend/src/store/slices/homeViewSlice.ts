import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { getHomeView, setHomeView as saveHomeView } from '@utils/preferences';

// Home view state slice with localStorage integration
const homeViewSlice = createSlice({
  name: 'homeView',
  initialState: getHomeView(), // Initialize from localStorage
  reducers: {
    setHomeView: (_state, action: PayloadAction<'map' | 'list'>) => {
      // Save to localStorage whenever Redux state changes
      saveHomeView(action.payload);
      return action.payload;
    },
  },
});

export const { setHomeView } = homeViewSlice.actions;
export const homeViewReducer = homeViewSlice.reducer;