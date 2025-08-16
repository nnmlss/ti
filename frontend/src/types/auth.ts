import type { ReactNode } from 'react';

// ===== AUTH USER TYPES =====
export interface AuthUser {
  id: string;
  email: string;
  username: string;
  isActive: boolean;
  isSuperAdmin?: boolean;
}

// ===== AUTH CONTEXT TYPES =====
export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

export interface AuthProviderProps {
  children: ReactNode;
}

// ===== AUTH API RESPONSE TYPES =====
export interface LoginResponse {
  login: {
    message: string;
    token: string;
    user: AuthUser;
  };
}

export interface RequestActivationResponse {
  requestActivation: {
    success: boolean;
    message: string;
  };
}

export interface ActivateAccountResponse {
  activateAccount: {
    message: string;
    token: string;
    user: AuthUser;
  };
}

export interface ValidateTokenResponse {
  validateToken: {
    valid: boolean;
    message: string;
  };
}

export interface AccountCreationResult {
  email: string;
  id?: string;
  success: boolean;
  message: string;
}

export interface CreateUserAccountsResponse {
  createUserAccounts: AccountCreationResult[];
}

export interface UpdateProfileInput {
  email?: string;
  username?: string;
  password?: string;
  currentPassword: string;
}

export interface UpdateProfileResponse {
  updateProfile: AuthUser;
}

// ===== AUTH HOOK RETURN TYPES =====
export interface UseActivationRequestReturn {
  loading: boolean;
  message: string;
  error: string;
  submitActivationRequest: (email: string) => Promise<void>;
  clearMessages: () => void;
}

export interface AppConstants {
  activationTokenExpiryMinutes: number;
}

export interface GetConstantsResponse {
  constants: AppConstants;
}

export interface UseConstantsReturn {
  expiryMinutes: number | null;
  loading: boolean;
  error: string | null;
}