import mongoose, { Schema, Document } from 'mongoose';

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
  description?: string;
  location?: Location;
}

export interface FlyingSite {
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
  landingFields?: {
    bg?: LandingFieldInfo[];
    en?: LandingFieldInfo[];
  };
  tracklogs?: string[];
  localPilotsClubs?: {
    bg?: string[];
    en?: string[];
  };
}

export interface FlyingSiteDocument extends FlyingSite, Document {}

const LocationSchema = new Schema({
  type: { type: String, enum: ['Point'], required: true },
  coordinates: { type: [Number], required: true },
});

const LocalizedTextSchema = new Schema({
  bg: { type: String },
  en: { type: String },
});

const GalleryImageSchema = new Schema({
  path: { type: String, required: true },
  author: { type: String },
  width: { type: Number },
  height: { type: Number },
});

const AccessOptionSchema = new Schema({
  _id: { type: Number, required: true },
  bg: [{ type: String }],
  en: [{ type: String }],
});

const LandingFieldInfoSchema = new Schema({
  description: { type: String },
  location: LocationSchema,
});

const FlyingSiteSchema = new Schema({
  _id: { type: Schema.Types.Mixed },
  title: { type: LocalizedTextSchema, required: true },
  windDirection: [
    {
      type: String,
      enum: [
        'N',
        'NNE',
        'NE',
        'ENE',
        'E',
        'ESE',
        'SE',
        'SSE',
        'S',
        'SSW',
        'SW',
        'WSW',
        'W',
        'WNW',
        'NW',
        'NNW',
      ],
      required: true,
    },
  ],
  location: { type: LocationSchema, required: true },
  accessOptions: [AccessOptionSchema],
  altitude: { type: Number },
  galleryImages: [GalleryImageSchema],
  accomodations: {
    bg: [{ type: String }],
    en: [{ type: String }],
  },
  alternatives: {
    bg: [{ type: String }],
    en: [{ type: String }],
  },
  access: LocalizedTextSchema,
  landingFields: {
    bg: [LandingFieldInfoSchema],
    en: [LandingFieldInfoSchema],
  },
  tracklogs: [{ type: String }],
  localPilotsClubs: {
    bg: [{ type: String }],
    en: [{ type: String }],
  },
});

export const Site = mongoose.model<FlyingSiteDocument>('Site', FlyingSiteSchema, 'paragliding');
