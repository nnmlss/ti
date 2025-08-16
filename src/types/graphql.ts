import type { CreateSiteData } from './database.js';

// ===== GRAPHQL RESOLVER ARGUMENT TYPES =====

// Site resolvers
export interface SiteByIdArgs {
  id: string;
}

export interface SitesByWindDirectionArgs {
  directions: string[];
}

export interface CreateSiteArgs {
  input: CreateSiteData;
}

export interface UpdateSiteArgs {
  id: string;
  input: Partial<CreateSiteData>;
}

export interface DeleteSiteArgs {
  id: string;
}

export interface UnsetSiteFieldsArgs {
  id: string;
  fields: string[];
}

// Authentication resolvers
export interface LoginArgs {
  username: string;
  password: string;
}

export interface RequestActivationArgs {
  email: string;
}

export interface ActivateAccountArgs {
  token: string;
  username: string;
  password: string;
}

export interface ValidateTokenArgs {
  token: string;
}

export interface CreateUserAccountsArgs {
  emails: string[];
}

export interface UpdateProfileArgs {
  input: {
    email?: string;
    username?: string;
    password?: string;
    currentPassword: string;
  };
}