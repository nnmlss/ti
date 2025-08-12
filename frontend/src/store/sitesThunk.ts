import { createAsyncThunk } from '@reduxjs/toolkit';

// Thunk for deleting a site
export const deleteSiteThunk = createAsyncThunk(
  'sites/deleteSite',
  async (siteId: string) => {
    const response = await fetch(`/api/site/${siteId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete site');
    }
    
    return siteId;
  }
);