import { GraphQLClient } from 'graphql-request';

// GraphQL client configuration
const endpoint = '/graphql'; // Proxied to backend in development

export const graphqlClient = new GraphQLClient(endpoint, {
  credentials: 'include', // Include cookies for authentication
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add CSRF protection for mutations
export const graphqlClientWithCSRF = new GraphQLClient(endpoint, {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest', // CSRF protection
  },
});

// Helper function to choose the right client
export const getGraphQLClient = (isMutation: boolean = false) => {
  return isMutation ? graphqlClientWithCSRF : graphqlClient;
};