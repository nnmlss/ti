import type { ReactNode } from 'react';
import type { FlyingSite, WindDirection, AccessOptionId } from './sites';
import type { AuthUser as AuthUserType } from './auth';
import type { SEOConfig } from './ui';

// ===== CONTAINER PROPS =====
export interface SiteCardContainerProps {
  site: FlyingSite;
}

export interface DeleteConfirmDialogContainerProps {
  open: boolean;
  onClose: () => void;
  siteId: number;
  title: string;
  onConfirm?: () => void;
}

export interface SiteDetailPageContainerProps {
  // Container has no props - gets everything from hooks
  readonly _brand?: 'SiteDetailPageContainerProps';
}

export interface AdminCreateAccountsContainerProps {
  // Container has no props - gets everything from hooks
  readonly _brand?: 'AdminCreateAccountsContainerProps';
}

export interface AdminCreateAccountsProps {
  fadeIn: boolean;
  onBackClick: () => void;
  emails: string[];
  loading: boolean;
  results: Array<{ email: string; success: boolean; message: string }> | null;
  error: string | null;
  successMessage: string | null;
  addEmailField: () => void;
  removeEmailField: (index: number) => void;
  updateEmail: (index: number, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export interface ProfileContainerProps {
  // Container has no props - gets everything from hooks
  readonly _brand?: 'ProfileContainerProps';
}

export interface ProfileProps {
  fadeIn: boolean;
  onBackClick: () => void;
  user: AuthUserType | null;
  formData: {
    email: string;
    username: string;
    password: string;
    repeatPassword: string;
    currentPassword: string;
  };
  loading: boolean;
  message: string;
  error: string;
  isCurrentPasswordValid: boolean;
  passwordCheckLoading: boolean;
  hasPasswordCheckCompleted: boolean;
  showRepeatPasswordError: boolean;
  showPasswordLengthError: boolean;
  hasStartedTypingCurrentPassword: boolean;
  doPasswordsMatch: boolean;
  needsCurrentPassword: boolean;
  isFormValid: boolean;
  resetField: (field: string) => void;
  handleInputChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export interface SitesListContainerProps {
  // Container has no props - gets everything from hooks
  readonly _brand?: 'SitesListContainerProps';
}

export interface SitesListProps {
  sites: FlyingSite[];
  loading: 'idle' | 'pending' | 'success' | 'error';
  error: string | null;
}

export interface SEOHeadProps {
  config: SEOConfig;
  site?: FlyingSite;
}

export interface AddSitePageContainerProps {
  // Container has no props - gets everything from hooks
  readonly _brand?: 'AddSitePageContainerProps';
}

export interface AddSitePageProps {
  onClose: () => void;
}

export interface EditSitePageContainerProps {
  // Container has no props - gets everything from hooks
  readonly _brand?: 'EditSitePageContainerProps';
}

export interface EditSitePageProps {
  site: FlyingSite | null;
  loading: 'idle' | 'pending' | 'success' | 'error';
  siteId: string;
  onClose: () => void;
}

export interface LoginContainerProps {
  // Container has no props - gets everything from hooks
  readonly _brand?: 'LoginContainerProps';
}

export interface LoginProps {
  username: string;
  password: string;
  loading: boolean;
  error: string | null;
  setUsername: (value: string) => void;
  setPassword: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onActivationClick: () => void;
}

export interface ActivationRequestContainerProps {
  // Container has no props - gets everything from hooks
  readonly _brand?: 'ActivationRequestContainerProps';
}

export interface ActivationRequestProps {
  email: string;
  loading: boolean;
  message: string | null;
  error: string | null;
  expiryMinutes: number;
  onSubmit: (e: React.FormEvent) => void;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface CompleteActivationContainerProps {
  // Container has no props - gets everything from hooks
  readonly _brand?: 'CompleteActivationContainerProps';
}

export interface CompleteActivationProps {
  username: string;
  password: string;
  confirmPassword: string;
  loading: boolean;
  validating: boolean;
  message: string | null;
  error: string | null;
  tokenValid: boolean | null;
  setUsername: (value: string) => void;
  setPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onRequestNewActivation: () => void;
}

export interface HomePageContainerProps {
  // Container has no props - gets everything from hooks
  readonly _brand?: 'HomePageContainerProps';
}

export interface HomePageProps {
  isListView: boolean;
  showWindFilter: boolean;
  onWindFilterClose: () => void;
}

// ===== COMPONENT PROPS =====
export interface SiteCardProps {
  site: FlyingSite;
  onEdit: () => void;
  onDelete: () => void;
  onViewDetails: () => void;
  onShowOnMap: () => void;
  deleteDialog: DeleteDialogState;
}


export interface SiteDetailViewContainerProps {
  site: FlyingSite;
  onClose: () => void;
}

export interface SiteDetailViewProps {
  site: FlyingSite;
  onOpenLocation: (coordinates: [number, number]) => void;
  onOpenTracklog: (url: string) => void;
  onClose: () => void;
}

export interface EditSiteContainerProps {
  site?: FlyingSite;
  onClose?: () => void;
}

export interface EditSiteProps {
  site?: FlyingSite;
  onClose?: () => void;
}

export interface WindDirectionCompassProps {
  windDirections: WindDirection[];
  size?: number;
}


export interface AccessOptionsViewProps {
  accessOptions: AccessOptionId[];
  size?: number;
  showLabels?: boolean;
}

export interface SitesMapProps {
  sites: FlyingSite[];
  loading: 'idle' | 'pending' | 'success' | 'error';
  error: string | null;
  onEdit: (siteId: number) => void;
  onDelete: (siteId: number) => void;
  onViewDetails: (site: FlyingSite) => void;
  onShowOnMap: (coordinates: [number, number]) => void;
  deleteDialog: {
    isOpen: boolean;
    targetId: number | null;
    onClose: () => void;
    onConfirm: () => void;
    targetTitle: string;
  };
}

// ===== PAGE PROPS =====
export interface HomePageProps {
  homeView: 'map' | 'list';
  filter: { windDirection: string | null };
  showWindFilter: boolean;
  isAuthenticated: boolean;
  onViewToggle: (view: 'map' | 'list') => void;
  onWindFilterToggle: () => void;
  onWindFilterClose: () => void;
}

export interface SiteDetailPageProps {
  site: FlyingSite | null;
  loading: 'idle' | 'pending' | 'success' | 'error';
  siteId: string;
  onClose: () => void;
}

// ===== USER INTERFACE PROPS =====

// ===== MIGRATION DIALOG PROPS =====
export interface MigrationResult {
  success: boolean;
  message: string;
  sitesUpdated: number;
  errors: string[];
}

export interface MigrationResultDialogProps {
  open: boolean;
  onClose: () => void;
  isLoading: boolean;
  result: MigrationResult | null;
  error: string | null;
}

// ===== DIALOG TYPES =====
export interface DeleteDialogState {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  isLoading: boolean;
  onConfirm: () => void;
}

export interface GlobalErrorNotificationProps {
  open: boolean;
  title: string | null;
  message: string;
  isRetrying: boolean;
  showRetryButton: boolean;
  showHomeButton: boolean;
  onClose: () => void;
  onRetry: () => void;
  onGoHome: () => void;
}

// ===== PROTECTED ROUTE PROPS =====
export interface ProtectedRouteContainerProps {
  children: ReactNode;
  requireSuperAdmin?: boolean;
}

export interface ProtectedRouteProps {
  state: 'loading' | 'access-denied';
}


// ===== PAGE HEADER PROPS =====
export interface PageHeaderProps {
  title: string;
  onBackClick: () => void;
}

// ===== NAVIGATION PROPS =====
export interface BottomNavigationBarProps {
  isAuthenticated: boolean;
  isHomePage: boolean;
  isListView: boolean;
  filter: { windDirection: string | null };
  onViewToggle: (view: 'map' | 'list') => void;
  onWindFilterOpen: () => void;
}