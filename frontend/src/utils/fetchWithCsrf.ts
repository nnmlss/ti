// Cache for CSRF token to avoid multiple requests
let csrfTokenCache: string | null = null;
let csrfTokenPromise: Promise<string> | null = null;

const fetchCsrfToken = async (): Promise<string> => {
  if (csrfTokenCache) {
    return csrfTokenCache;
  }

  if (csrfTokenPromise) {
    return csrfTokenPromise;
  }

  csrfTokenPromise = (async () => {
    try {
      const response = await fetch('/api/csrf-token', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch CSRF token');
      }

      const data = await response.json();
      csrfTokenCache = data.csrfToken;
      
      // Cache for 10 minutes, then refetch
      setTimeout(() => {
        csrfTokenCache = null;
        csrfTokenPromise = null;
      }, 10 * 60 * 1000);

      return csrfTokenCache;
    } catch (error) {
      csrfTokenPromise = null;
      throw error;
    }
  })();

  return csrfTokenPromise;
};

export const fetchWithCsrf = async (url: string, options: RequestInit = {}): Promise<Response> => {
  // Only add CSRF token for non-GET requests
  if (!options.method || options.method.toUpperCase() === 'GET') {
    return fetch(url, {
      ...options,
      credentials: 'include',
    });
  }

  try {
    const csrfToken = await fetchCsrfToken();

    const headers = new Headers(options.headers);
    headers.set('X-CSRF-Token', csrfToken);

    return fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });
  } catch (error) {
    console.error('Failed to add CSRF token:', error);
    // Fallback: attempt request without CSRF (will likely fail but gives better error)
    return fetch(url, {
      ...options,
      credentials: 'include',
    });
  }
};