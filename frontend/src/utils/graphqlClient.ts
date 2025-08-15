import { GraphQLClient } from 'graphql-request';

// GraphQL client configuration  
const endpoint = window.location.origin + '/graphql'; // Dynamic absolute URL

// Helper function to get auth headers
const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const graphqlClient = new GraphQLClient(endpoint, {
  credentials: 'include', // Include cookies for authentication
  headers: {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
  },
});

// Add CSRF protection for mutations
export const graphqlClientWithCSRF = new GraphQLClient(endpoint, {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest', // CSRF protection
    ...getAuthHeaders(),
  },
});

// Helper function to choose the right client with fresh auth headers
export const getGraphQLClient = (isMutation: boolean = false) => {
  // Create fresh client with current auth token
  const authHeaders = getAuthHeaders();
  
  if (isMutation) {
    return new GraphQLClient(endpoint, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...authHeaders,
      },
    });
  } else {
    return new GraphQLClient(endpoint, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
    });
  }
};