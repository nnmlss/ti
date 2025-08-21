/**
 * Network connectivity utilities to distinguish between network and server issues
 */

/**
 * Check if user has internet connectivity by pinging a reliable external service
 * @returns Promise<boolean> - true if connected, false if no internet
 */
export async function checkNetworkConnectivity(): Promise<boolean> {
  try {
    // Try multiple reliable endpoints to ensure accuracy
    const endpoints = [
      'https://www.google.com/favicon.ico',
      'https://cloudflare.com/cdn-cgi/trace',
      'https://httpbin.org/status/200'
    ];

    // Use Promise.race to get the fastest response
    const promises = endpoints.map(url => 
      fetch(url, { 
        method: 'HEAD',
        mode: 'no-cors', // Avoid CORS issues
        cache: 'no-cache',
        signal: AbortSignal.timeout(3000) // 3 second timeout
      })
    );

    await Promise.race(promises);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if our own server is reachable (but may be returning errors)
 * @returns Promise<boolean> - true if server responds (even with errors), false if unreachable
 */
export async function checkServerReachability(): Promise<boolean> {
  try {
    // Try GraphQL endpoint - it should always respond even if with errors
    await fetch('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '{ __typename }' }), // Simple introspection query
      cache: 'no-cache',
      signal: AbortSignal.timeout(5000) // 5 second timeout
    });
    return true;
  } catch {
    // Try CSRF endpoint as fallback
    try {
      await fetch('/api/csrf-token', {
        method: 'GET',
        cache: 'no-cache',
        signal: AbortSignal.timeout(5000)
      });
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Determine the type of connectivity issue
 * @returns Promise<'network' | 'server' | 'unknown'>
 */
export async function diagnoseConnectivityIssue(): Promise<'network' | 'server' | 'unknown'> {
  try {
    const [hasInternet, serverReachable] = await Promise.all([
      checkNetworkConnectivity(),
      checkServerReachability()
    ]);

    if (!hasInternet) {
      return 'network'; // No internet connection
    } else if (!serverReachable) {
      return 'server'; // Internet works, but our server is down
    } else {
      return 'unknown'; // Both work, but getting 500 errors (server internal issues)
    }
  } catch {
    return 'unknown';
  }
}