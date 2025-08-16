// ===== WIND DIRECTION TYPES =====
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

// ===== ACCESS OPTION TYPES =====
export type AccessOptionId = 0 | 1 | 2 | 3 | 4;

// ===== LOCALIZED TEXT TYPES =====
export interface LocalizedText {
  bg?: string;
  en?: string;
}

// ===== LOCATION TYPES =====
export interface Location {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

// ===== GALLERY IMAGE TYPES =====
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

// ===== LANDING FIELD TYPES =====
export interface LandingFieldInfo {
  description?: LocalizedText;
  location?: Location;
}

// ===== USER TYPES =====
export interface User {
  _id: string;
  email: string;
  password?: string;
  username?: string;
  invitationToken?: string;
  tokenExpiry?: Date;
  isActive: boolean;
  isSuperAdmin?: boolean;
}

// ===== FLYING SITE TYPES =====
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

// ===== ERROR TYPES =====
export interface CustomError extends Error {
  status?: number;
  isValidationError?: boolean;
  errors?: Array<{
    msg: string;
    param?: string;
    value?: unknown;
    location?: string;
  }>;
}