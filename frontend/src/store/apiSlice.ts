import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { FlyingSite } from '../types';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Site'],
  endpoints: (builder) => ({
    getSites: builder.query<FlyingSite[], void>({
      query: () => '/sites',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Site' as const, id: _id })),
              { type: 'Site', id: 'LIST' },
            ]
          : [{ type: 'Site', id: 'LIST' }],
      keepUnusedDataFor: 60, // Cache for 1 minute
    }),
    getSite: builder.query<FlyingSite, string>({
      query: (id) => `/site/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Site', id }],
    }),
    addSite: builder.mutation<FlyingSite, Partial<FlyingSite>>({
      query: (body) => ({
        url: '/sites',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Site', id: 'LIST' }],
    }),
    updateSite: builder.mutation<FlyingSite, Partial<FlyingSite>>({
      query: (data) => {
        const { _id, ...body } = data;
        return {
          url: `/site/${_id}`,
          method: 'PUT',
          body,
        };
      },
      invalidatesTags: (_result, _error, { _id }) => [{ type: 'Site', id: _id }],
    }),
    deleteSite: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/site/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Site', id }],
    }),
  }),
});

export const {
  useGetSitesQuery,
  useGetSiteQuery,
  useAddSiteMutation,
  useUpdateSiteMutation,
} = apiSlice;
