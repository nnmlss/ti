import { createAsyncThunk } from '@reduxjs/toolkit';

// Generate thumbnails for an image
export const generateThumbnailsThunk = createAsyncThunk(
  'thumbnails/generateThumbnails',
  async (filename: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/image/generate-thumbnails/${filename}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to generate thumbnails');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Network error');
    }
  }
);