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

// ===== ACCESS OPTION TYPES =====
export type AccessOptionId = 0 | 1 | 2 | 3 | 4;

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

// ===== LANDING FIELD TYPES =====
export interface LandingFieldInfo {
  description?: LocalizedText;
  location?: Location;
}

// ===== FLYING SITE TYPES =====
export interface FlyingSite {
  _id: number;
  title: LocalizedText;
  url?: string;
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