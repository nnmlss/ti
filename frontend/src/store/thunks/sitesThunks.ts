import { createAsyncThunk } from '@reduxjs/toolkit';
import type { FlyingSite } from '../../types';

// Thunk for loading a single site (for edit/view with full data)
export const loadSingleSiteThunk = createAsyncThunk(
  'sites/loadSingleSite',
  async (siteId: number) => {
    const response = await fetch(`/api/site/${siteId}`);

    if (!response.ok) {
      throw new Error('Failed to load site');
    }

    const site: FlyingSite = await response.json();
    return site;
  }
);

// Thunk for loading all sites
export const loadSitesThunk = createAsyncThunk('sites/loadSites', async () => {
  const response = await fetch('/api/sites');

  if (!response.ok) {
    throw new Error('Failed to load sites');
  }

  const sites: FlyingSite[] = await response.json();
  return sites;
});

// Thunk for adding a site
export const addSiteThunk = createAsyncThunk(
  'sites/addSite',
  async (siteData: Partial<FlyingSite>) => {
    const response = await fetch('/api/site', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(siteData),
    });

    if (!response.ok) {
      throw new Error('Failed to add site');
    }

    const newSite: FlyingSite = await response.json();
    return newSite;
  }
);

// Thunk for updating a site
export const updateSiteThunk = createAsyncThunk(
  'sites/updateSite',
  async (siteData: Partial<FlyingSite>) => {
    const { _id, ...body } = siteData;
    const response = await fetch(`/api/site/${_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error('Failed to update site');
    }

    const updatedSite: FlyingSite = await response.json();
    return updatedSite;
  }
);

// Thunk for deleting a site
export const deleteSiteThunk = createAsyncThunk('sites/deleteSite', async (siteId: number) => {
  const response = await fetch(`/api/site/${siteId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete site');
  }

  return siteId;
});
