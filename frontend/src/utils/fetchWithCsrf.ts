// Custom header-based CSRF protection - no token caching needed

export const fetchWithCsrf = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const headers = new Headers(options.headers);
  
  // Add custom header for CSRF protection on non-GET requests
  if (options.method && options.method.toUpperCase() !== 'GET') {
    headers.set('X-Requested-With', 'XMLHttpRequest');
  }

  return fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });
};