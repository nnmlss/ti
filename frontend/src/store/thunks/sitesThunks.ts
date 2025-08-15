import { createAsyncThunk } from '@reduxjs/toolkit';
import type { 
  FlyingSite, 
  GraphQLErrorResponse,
  GetSiteDetailResponse,
  GetSitesListResponse,
  CreateSiteResponse,
  UpdateSiteResponse,
  UnsetSiteFieldsResponse,
  WindDirection,
  Location,
  AccessOptionId,
  GraphQLSite
} from '@types';
import { getGraphQLClient } from '@utils/graphqlClient';
import {
  GET_SITES_LIST,
  GET_SITE_DETAIL,
  CREATE_SITE,
  UPDATE_SITE,
  UNSET_SITE_FIELDS,
  DELETE_SITE,
} from '@utils/graphqlQueries';

// Helper function to transform frontend FlyingSite to GraphQL input format
function transformToGraphQLInput(siteData: Partial<FlyingSite>): Omit<Partial<FlyingSite>, '_id'> {
  const { _id, $unset: _$unset, ...rest } = siteData as Partial<FlyingSite> & { $unset?: unknown }; // Remove MongoDB operators
  
  return {
    ...rest,
    // Ensure required fields have defaults
    windDirection: rest.windDirection || [],
    accessOptions: rest.accessOptions || [],
    // Transform any frontend-specific formats to GraphQL format if needed
    landingFields: rest.landingFields?.map(field => ({
      description: field.description,
      location: field.location,
    })),
  };
}

// Helper function to transform GraphQL response to frontend FlyingSite type
function transformGraphQLSite(graphqlSite: GraphQLSite): FlyingSite {
  return {
    ...graphqlSite,
    _id: parseInt(graphqlSite.id), // Convert string ID back to number
    windDirection: graphqlSite.windDirection as WindDirection[], // Cast strings to WindDirection enum
    location: graphqlSite.location as Location, // Cast location to proper type
    accessOptions: graphqlSite.accessOptions as AccessOptionId[], // Cast numbers to AccessOptionId
    // Convert null values to undefined for optional fields
    galleryImages: graphqlSite.galleryImages ? graphqlSite.galleryImages.map(img => ({
      ...img,
      author: img.author || undefined,
      width: img.width || undefined,
      height: img.height || undefined,
      format: img.format || undefined,
      thumbnail: img.thumbnail || undefined,
      small: img.small || undefined,
      large: img.large || undefined,
    })) : undefined,
    access: graphqlSite.access || undefined,
    accomodations: graphqlSite.accomodations || undefined,
    alternatives: graphqlSite.alternatives || undefined,
    landingFields: graphqlSite.landingFields ? graphqlSite.landingFields.map(field => ({
      description: field.description || undefined,
      location: field.location ? field.location as Location : undefined,
    })) : undefined,
    tracklogs: graphqlSite.tracklogs || undefined,
    localPilotsClubs: graphqlSite.localPilotsClubs || undefined,
    unique: graphqlSite.unique || undefined,
    monuments: graphqlSite.monuments || undefined,
  };
}

// Thunk for loading a single site (for edit/view with full data)
export const loadSingleSiteThunk = createAsyncThunk(
  'sites/loadSingleSite',
  async (siteId: number, { rejectWithValue }) => {
    try {
      const client = getGraphQLClient(false); // Read-only query
      const data = await client.request<GetSiteDetailResponse>(GET_SITE_DETAIL, { id: siteId.toString() });
      
      if (!data.site) {
        return rejectWithValue('Site not found');
      }

      // Transform GraphQL response to match frontend FlyingSite type
      const site = transformGraphQLSite(data.site);
      return site;
    } catch (error) {
      // Handle GraphQL errors properly
      const graphqlError = error as GraphQLErrorResponse;
      const errorMessage = graphqlError.response?.errors?.[0]?.message || 
                          graphqlError.message || 
                          'Failed to load site';
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk for loading all sites (list view - minimal data)
export const loadSitesThunk = createAsyncThunk('sites/loadSites', async (_, { rejectWithValue }) => {
  try {
    const client = getGraphQLClient(false); // Read-only query
    const data = await client.request<GetSitesListResponse>(GET_SITES_LIST);

    // Transform GraphQL response to match frontend FlyingSite type
    const sites = data.sites.map(transformGraphQLSite);
    return sites;
  } catch (error) {
    const graphqlError = error as GraphQLErrorResponse;
    const errorMessage = graphqlError.response?.errors?.[0]?.message || 
                        graphqlError.message || 
                        'Failed to load sites';
    return rejectWithValue(errorMessage);
  }
});

// Thunk for adding a site
export const addSiteThunk = createAsyncThunk(
  'sites/addSite',
  async (siteData: Partial<FlyingSite>, { rejectWithValue }) => {
    console.log('🚀 addSiteThunk called!');
    try {
      const client = getGraphQLClient(true); // Mutation with CSRF
      const input = transformToGraphQLInput(siteData); // Transform to GraphQL format
      
      // Debug: Log what we're sending
      console.log('Frontend addSite siteData:', JSON.stringify(siteData, null, 2));
      console.log('Frontend addSite input after transform:', JSON.stringify(input, null, 2));
      
      const data = await client.request<CreateSiteResponse>(CREATE_SITE, { input });

      // Transform GraphQL response to match frontend FlyingSite type
      const newSite = transformGraphQLSite(data.createSite);
      return newSite;
    } catch (error) {
      const graphqlError = error as GraphQLErrorResponse;
      const errorMessage = graphqlError.response?.errors?.[0]?.message || 
                          graphqlError.message || 
                          'Failed to add site';
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk for updating a site
export const updateSiteThunk = createAsyncThunk(
  'sites/updateSite',
  async (siteData: Partial<FlyingSite>, { rejectWithValue }) => {
    try {
      const { _id, $unset } = siteData as Partial<FlyingSite> & { $unset?: Record<string, 1> };
      
      if (!_id) {
        return rejectWithValue('Site ID is required for update');
      }

      // Auto-detect fields that should be unset (empty arrays/objects for optional fields)
      const fieldsToUnset: string[] = [];
      const optionalArrayFields = ['galleryImages', 'tracklogs', 'landingFields'];
      const optionalObjectFields = ['accomodations', 'alternatives', 'localPilotsClubs', 'access', 'unique', 'monuments'];
      
      optionalArrayFields.forEach(field => {
        const value = siteData[field as keyof FlyingSite];
        if (value === undefined || (Array.isArray(value) && value.length === 0)) {
          fieldsToUnset.push(field);
        }
      });
      
      optionalObjectFields.forEach(field => {
        const value = siteData[field as keyof FlyingSite];
        if (value === undefined) {
          fieldsToUnset.push(field);
        } else if (value && typeof value === 'object') {
          const hasContent = Object.values(value).some(v => 
            v !== undefined && v !== null && 
            !(typeof v === 'string' && v === '') && 
            !(Array.isArray(v) && v.length === 0)
          );
          if (!hasContent) {
            fieldsToUnset.push(field);
          }
        }
      });
      

      const client = getGraphQLClient(true); // Mutation with CSRF
      
      // Always do regular update first with non-empty fields
      const input = transformToGraphQLInput(siteData); // Transform to GraphQL format
      
      const data = await client.request<UpdateSiteResponse>(UPDATE_SITE, { 
        id: _id.toString(), 
        input 
      });

      // Handle $unset operation (explicit or auto-detected) AFTER regular update
      const finalFieldsToUnset = $unset ? Object.keys($unset) : fieldsToUnset;
      
      if (finalFieldsToUnset.length > 0) {
        const unsetData = await client.request<UnsetSiteFieldsResponse>(UNSET_SITE_FIELDS, { 
          id: _id.toString(), 
          fields: finalFieldsToUnset 
        });
        
        // Transform GraphQL response from unset operation
        const updatedSite = transformGraphQLSite(unsetData.unsetSiteFields);
        return updatedSite;
      } else {
        // Transform GraphQL response from regular update
        const updatedSite = transformGraphQLSite(data.updateSite);
        return updatedSite;
      }
    } catch (error) {
      const graphqlError = error as GraphQLErrorResponse;
      const errorMessage = graphqlError.response?.errors?.[0]?.message || 
                          graphqlError.message || 
                          'Failed to update site';
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk for deleting a site
export const deleteSiteThunk = createAsyncThunk('sites/deleteSite', async (siteId: number, { rejectWithValue }) => {
  try {
    const client = getGraphQLClient(true); // Mutation with CSRF
    await client.request(DELETE_SITE, { id: siteId.toString() });

    return siteId;
  } catch (error) {
    const graphqlError = error as GraphQLErrorResponse;
    const errorMessage = graphqlError.response?.errors?.[0]?.message || 
                        graphqlError.message || 
                        'Failed to delete site';
    return rejectWithValue(errorMessage);
  }
});
