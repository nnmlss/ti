import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

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

export const { setHomeView } = homeViewSlice.actions;
export const homeViewReducer = homeViewSlice.reducer;