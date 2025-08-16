import type { Request } from 'express';

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

// ===== GRAPHQL CONTEXT TYPES =====
export interface GraphQLContext {
  user?: {
    id: string;
    email: string;
    username: string;
    isActive: boolean;
    isSuperAdmin?: boolean;
  } | null;
  isSuperAdmin: boolean;
}