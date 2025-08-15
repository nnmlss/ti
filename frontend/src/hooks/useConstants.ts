import { useState, useEffect } from 'react';
import { getGraphQLClient } from '@utils/graphqlClient';
import { GET_CONSTANTS } from '@utils/graphqlQueries';
import type { GetConstantsResponse, UseConstantsReturn } from '@types';

export const useConstants = (): UseConstantsReturn => {
  const [expiryMinutes, setExpiryMinutes] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConstants = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const client = getGraphQLClient(false);
        const data = await client.request<GetConstantsResponse>(GET_CONSTANTS);
        setExpiryMinutes(data.constants.activationTokenExpiryMinutes);
      } catch (err) {
        console.error('Failed to load constants:', err);
        setError('Failed to load constants');
        // Keep default value null
      } finally {
        setLoading(false);
      }
    };

    loadConstants();
  }, []);

  return {
    expiryMinutes,
    loading,
    error,
  };
};