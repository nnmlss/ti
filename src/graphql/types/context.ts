export interface GraphQLContext {
  user?: {
    id: string;
    email: string;
    username: string;
    isActive: boolean;
    isSuperAdmin?: boolean;
  } | null;
}