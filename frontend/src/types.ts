export type WindDirection =
  | 'N'
  | 'NNE'
  | 'NE'
  | 'ENE'
  | 'E'
  | 'ESE'
  | 'SE'
  | 'SSE'
  | 'S'
  | 'SSW'
  | 'SW'
  | 'WSW'
  | 'W'
  | 'WNW'
  | 'NW'
  | 'NNW';

export interface LocalizedText {
  bg?: string;
  en?: string;
}

export interface Location {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface GalleryImage {
  path: string;
  author?: string;
  width?: number;
  height?: number;
  format?: string;
  thumbnail?: string;
  small?: string;
  large?: string;
}

export interface GalleryImageItemProps {
  image: GalleryImage;
  onDelete: (imagePath: string) => void;
  onUpdate: (imagePath: string, updates: Partial<GalleryImage>) => void;
  isMarkedForDeletion: boolean;
}

export interface GalleryImageListProps {
  images: GalleryImage[];
  onImageDelete: (imagePath: string) => void;
  onImageUpdate: (imagePath: string, updates: Partial<GalleryImage>) => void;
  imagesToDelete: Set<string>;
  error?: string | null;
}

export type AccessOptionId = 0 | 1 | 2 | 3 | 4;

export interface LandingFieldInfo {
  description?: LocalizedText;
  location?: Location;
}

export interface FlyingSite {
  _id: number;
  title: LocalizedText;
  windDirection: WindDirection[];
  location: Location;
  accessOptions: AccessOptionId[];
  altitude?: number | null;
  galleryImages?: GalleryImage[];
  accomodations?: {
    bg?: string[];
    en?: string[];
  };
  alternatives?: {
    bg?: string[];
    en?: string[];
  };
  access?: LocalizedText;
  landingFields?: LandingFieldInfo[];
  tracklogs?: string[];
  localPilotsClubs?: {
    bg?: string[];
    en?: string[];
  };
  unique?: LocalizedText;
  monuments?: LocalizedText;
}

// GraphQL error handling types
export interface GraphQLError {
  message: string;
  extensions?: {
    code?: string;
  };
}

export interface GraphQLErrorResponse {
  response?: {
    errors?: GraphQLError[];
  };
  message?: string;
}

// GraphQL response types
export interface GraphQLSite {
  id: string;
  title: { bg?: string; en?: string };
  windDirection: string[];
  location: { type: string; coordinates: number[] };
  accessOptions: number[];
  altitude?: number | null;
  access?: { bg?: string; en?: string } | null;
  accomodations?: { bg?: string[]; en?: string[] } | null;
  alternatives?: { bg?: string[]; en?: string[] } | null;
  galleryImages?: Array<{
    path: string;
    author?: string | null;
    width?: number | null;
    height?: number | null;
    format?: string | null;
    thumbnail?: string | null;
    small?: string | null;
    large?: string | null;
  }> | null;
  landingFields?: Array<{
    description?: { bg?: string; en?: string } | null;
    location?: { type: string; coordinates: number[] } | null;
  }> | null;
  tracklogs?: string[] | null;
  localPilotsClubs?: { bg?: string[]; en?: string[] } | null;
  unique?: { bg?: string; en?: string } | null;
  monuments?: { bg?: string; en?: string } | null;
}

export interface GetSiteDetailResponse {
  site: GraphQLSite | null;
}

export interface GetSitesListResponse {
  sites: GraphQLSite[];
}

export interface CreateSiteResponse {
  createSite: GraphQLSite;
}

export interface UpdateSiteResponse {
  updateSite: GraphQLSite;
}

export interface UnsetSiteFieldsResponse {
  unsetSiteFields: GraphQLSite;
}

// Auth types
export interface AuthUser {
  id: string;
  email: string;
  username: string;
  isActive: boolean;
  isSuperAdmin?: boolean;
}

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

export interface AppConstants {
  activationTokenExpiryMinutes: number;
}

export interface GetConstantsResponse {
  constants: AppConstants;
}

// Custom hooks interfaces
export interface UseActivationRequestReturn {
  loading: boolean;
  message: string;
  error: string;
  submitActivationRequest: (email: string) => Promise<void>;
  clearMessages: () => void;
}

export interface UseConstantsReturn {
  expiryMinutes: number | null;
  loading: boolean;
  error: string | null;
}
