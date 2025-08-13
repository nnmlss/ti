import { createAsyncThunk } from '@reduxjs/toolkit';
import type { FlyingSite } from '../../types';

// Thunk for loading a single site (for edit/view with full data)
export const loadSingleSiteThunk = createAsyncThunk(
  'sites/loadSingleSite',
  async (siteId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/site/${siteId}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Failed to load site (${response.status})`;
        return rejectWithValue(errorMessage);
      }

      const site: FlyingSite = await response.json();
      return site;
    } catch (error) {
      return rejectWithValue('Network error: Unable to connect to server');
    }
  }
);

// Thunk for loading all sites
export const loadSitesThunk = createAsyncThunk('sites/loadSites', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch('/api/sites');

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || `Failed to load sites (${response.status})`;
      return rejectWithValue(errorMessage);
    }

    const sites: FlyingSite[] = await response.json();
    return sites;
  } catch (error) {
    return rejectWithValue('Network error: Unable to connect to server');
  }
});

// Thunk for adding a site
export const addSiteThunk = createAsyncThunk(
  'sites/addSite',
  async (siteData: Partial<FlyingSite>, { rejectWithValue }) => {
    const response = await fetch('/api/site', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(siteData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.errors?.map((err: { msg: string }) => err.msg).join(', ') || 'Failed to add site';
      return rejectWithValue(errorMessage);
    }

    const newSite: FlyingSite = await response.json();
    return newSite;
  }
);

// Thunk for updating a site
export const updateSiteThunk = createAsyncThunk(
  'sites/updateSite',
  async (siteData: Partial<FlyingSite>, { rejectWithValue }) => {
    try {
      const { _id, ...body } = siteData;
      const response = await fetch(`/api/site/${_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Failed to update site (${response.status})`;
        return rejectWithValue(errorMessage);
      }

      const updatedSite: FlyingSite = await response.json();
      return updatedSite;
    } catch (error) {
      return rejectWithValue('Network error: Unable to connect to server');
    }
  }
);

// Thunk for deleting a site
export const deleteSiteThunk = createAsyncThunk('sites/deleteSite', async (siteId: number, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/site/${siteId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || `Failed to delete site (${response.status})`;
      return rejectWithValue(errorMessage);
    }

    return siteId;
  } catch (error) {
    return rejectWithValue('Network error: Unable to connect to server');
  }
});
