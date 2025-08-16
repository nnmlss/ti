import { useState, useEffect } from 'react';

interface CsrfResponse {
  csrfToken: string;
}

export const useCsrfToken = () => {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch('/api/csrf-token', {
          credentials: 'include', // Include session cookie
        });
        
        if (response.ok) {
          const data: CsrfResponse = await response.json();
          setCsrfToken(data.csrfToken);
        }
      } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCsrfToken();
  }, []);

  // Helper function to get headers with CSRF token
  const getCsrfHeaders = () => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (csrfToken) {
      headers['X-CSRF-Token'] = csrfToken;
    }
    
    return headers;
  };

  return {
    csrfToken,
    loading,
    getCsrfHeaders,
  };
};