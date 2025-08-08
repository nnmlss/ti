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
  coordinates: [number | null, number | null]; // [longitude, latitude]
}

export interface GalleryImage {
  path: string;
  author?: string;
  width?: number;
  height?: number;
}

export interface AccessOption {
  _id: number;
  bg?: string[];
  en?: string[];
}

export interface LandingFieldInfo {
  description?: LocalizedText;
  location?: Location;
}

export interface FlyingSite {
  _id: string;
  title: LocalizedText;
  windDirection: WindDirection[];
  location: Location;
  accessOptions: AccessOption[];
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
}
