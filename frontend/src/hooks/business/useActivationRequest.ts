import { useState } from 'react';
import { getGraphQLClient } from '@utils/graphqlClient';
import { REQUEST_ACTIVATION } from '@utils/graphqlQueries';
import type { RequestActivationResponse, UseActivationRequestReturn } from '@app-types';

export const useActivationRequest = (): UseActivationRequestReturn => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const clearMessages = () => {
    setMessage('');
    setError('');
  };

  const submitActivationRequest = async (email: string): Promise<void> => {
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    setLoading(true);
    clearMessages();

    try {
      const client = getGraphQLClient(false); // No CSRF needed for request activation
      const data = await client.request<RequestActivationResponse>(REQUEST_ACTIVATION, {
        email: email.trim(),
      });

      if (data.requestActivation.success) {
        setMessage(data.requestActivation.message);
      } else {
        setError(data.requestActivation.message || 'An error occurred');
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      setError('Failed to send activation request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    message,
    error,
    submitActivationRequest,
    clearMessages,
  };
};
