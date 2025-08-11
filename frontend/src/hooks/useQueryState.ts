import { useMemo } from 'react';
import type { UseQueryHookResult } from '@reduxjs/toolkit/query/react';
import type { AsyncState } from './useAsyncState';

// Adapter Pattern - Converts RTK Query interface to our standard AsyncState interface
export interface QueryStateAdapter<T> extends AsyncState<T> {
  refetch: () => void;
  isFetching: boolean;
  isUninitialized: boolean;
  originalError: any;
}

export interface QueryOptions {
  selectData?: (data: any) => any;
  selectError?: (error: any) => string;
  resetOnRefetch?: boolean;
}

/**
 * Adapter hook that converts RTK Query results to our standard AsyncState interface
 * This provides a unified interface regardless of the underlying query mechanism
 */
export const useQueryState = <T = any>(
  queryResult: UseQueryHookResult<T, any>,
  options: QueryOptions = {}
): QueryStateAdapter<T> => {
  const {
    selectData = (data: T) => data,
    selectError = (error: any) => error?.message || error?.data?.message || 'An error occurred',
    resetOnRefetch = false,
  } = options;

  return useMemo(() => {
    const {
      data: rawData,
      error: rawError,
      isLoading,
      isFetching,
      isSuccess,
      isError,
      isUninitialized,
      refetch,
    } = queryResult;

    // Transform data using selector if provided
    const data = rawData ? selectData(rawData) : null;
    
    // Transform error using selector if provided
    const error = rawError ? selectError(rawError) : null;

    // Determine status based on RTK Query states
    let status: 'idle' | 'loading' | 'success' | 'error';
    if (isUninitialized) {
      status = 'idle';
    } else if (isLoading || (isFetching && resetOnRefetch)) {
      status = 'loading';
    } else if (isError) {
      status = 'error';
    } else if (isSuccess) {
      status = 'success';
    } else {
      status = 'idle';
    }

    return {
      // AsyncState interface
      data,
      error,
      status,
      isIdle: isUninitialized || status === 'idle',
      isLoading: isLoading || (isFetching && resetOnRefetch),
      isSuccess,
      isError,
      
      // Additional RTK Query specific properties
      refetch: () => {
        refetch();
      },
      isFetching,
      isUninitialized,
      originalError: rawError,
    };
  }, [
    queryResult,
    selectData,
    selectError,
    resetOnRefetch,
  ]);
};

/**
 * Specialized adapter for paginated queries
 */
export const usePaginatedQueryState = <T = any>(
  queryResult: UseQueryHookResult<{ data: T[]; total: number; page: number }, any>
) => {
  return useQueryState(queryResult, {
    selectData: (result) => ({
      items: result.data,
      total: result.total,
      page: result.page,
      hasMore: result.data.length < result.total,
    }),
  });
};

/**
 * Specialized adapter for queries that return arrays
 */
export const useArrayQueryState = <T = any>(
  queryResult: UseQueryHookResult<T[], any>
) => {
  return useQueryState(queryResult, {
    selectData: (data: T[]) => ({
      items: data,
      count: data.length,
      isEmpty: data.length === 0,
    }),
  });
};