import { createAsyncThunk } from '@reduxjs/toolkit';

export interface ImageUploadResponse {
  message: string;
  image: {
    path: string;
    originalName: string;
    mimetype: string;
    size: number;
    width?: number;
    height?: number;
    format?: string;
    thumbnail?: string;
    small?: string;
    large?: string;
  };
}

export interface ImageDeleteResponse {
  message: string;
  filename: string;
}

// Thunk for uploading an image
export const uploadImageThunk = createAsyncThunk(
  'images/uploadImage',
  async (file: File, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/image/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Failed to upload image (${response.status})`;
        return rejectWithValue(errorMessage);
      }

      const result: ImageUploadResponse = await response.json();
      return result;
    } catch {
      return rejectWithValue('Network error: Unable to connect to server');
    }
  }
);

// Thunk for deleting an image
export const deleteImageThunk = createAsyncThunk(
  'images/deleteImage',
  async (filename: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/image/${encodeURIComponent(filename)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Failed to delete image (${response.status})`;
        return rejectWithValue(errorMessage);
      }

      const result: ImageDeleteResponse = await response.json();
      return { ...result, filename };
    } catch {
      return rejectWithValue('Network error: Unable to connect to server');
    }
  }
);