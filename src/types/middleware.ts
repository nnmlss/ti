import type { Request } from 'express';

// ===== GRAPHQL YOGA TYPES =====
export interface YogaInitialContext {
  req: Request | {
    headers?: {
      authorization?: string;
      get?: (name: string) => string | null;
    } | Headers;
  };
}

// ===== EXPRESS MIDDLEWARE TYPES =====
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
    isActive: boolean;
    isSuperAdmin?: boolean;
  };
}

// ===== JWT TYPES =====
export interface JWTPayload {
  id: string;
  email: string;
  username: string;
  isActive: boolean;
  isSuperAdmin?: boolean;
  iat?: number;
  exp?: number;
}

export interface UserForToken {
  _id: string;
  email: string;
  username: string;
  isActive: boolean;
  isSuperAdmin?: boolean;
}

// ===== GRAPHQL CONTEXT TYPES =====
export interface PublicGraphQLContext {
  // No user properties - for read operations and auth operations
}

export interface AuthenticatedGraphQLContext {
  user: {
    id: string;
    email: string;
    username: string;
    isActive: boolean;
    isSuperAdmin: boolean;
  };
}

// Union type for resolvers that might receive either
export type GraphQLContext = PublicGraphQLContext | AuthenticatedGraphQLContext;

// Type guard to check if context has user
export function isAuthenticatedContext(context: GraphQLContext): context is AuthenticatedGraphQLContext {
  return 'user' in context;
}