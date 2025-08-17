import type { ReactNode } from 'react';
import type { FlyingSite, WindDirection, AccessOptionId } from './sites';
import type { AuthUser as AuthUserType } from './auth';

// ===== CONTAINER PROPS =====
export interface SiteCardContainerProps {
  site: FlyingSite;
}

export interface WindDirectionFilterContainerProps {
  onClose: () => void;
}

export interface DeleteConfirmDialogContainerProps {
  open: boolean;
  onClose: () => void;
  siteId: number;
  title: string;
  onConfirm?: () => void;
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

export interface SiteCardContentProps {
  site: FlyingSite;
  onEdit: (e?: React.MouseEvent) => void;
  onDelete: (e?: React.MouseEvent) => void;
  onViewDetails: () => void;
  onShowOnMap: (e?: React.MouseEvent) => void;
  variant?: 'card' | 'popup';
  compassSize?: number;
  isAuthenticated: boolean;
  isPopup: boolean;
}

export interface SiteDetailViewProps {
  site: FlyingSite;
}

export interface EditSiteProps {
  site?: FlyingSite;
  onClose?: () => void;
}

export interface WindDirectionCompassProps {
  windDirections: WindDirection[];
  size?: number;
}

export interface WindDirectionFilterProps {
  selectedFilter: string | null;
  onFilterSelect: (direction: string) => void;
  onClearFilter: () => void;
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
export interface UserIconGroupProps {
  user: AuthUserType;
  onProfileClick: () => void;
  onLogout: () => void;
  onAddUser: () => void;
  onMigrateUrls: () => void;
}

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
export interface ProtectedRouteProps {
  children: ReactNode;
  requireSuperAdmin?: boolean;
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