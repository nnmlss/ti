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

export interface CustomError extends Error {
  status?: number;
  isValidationError?: boolean;
  errors?: Array<{
    msg: string;
    [key: string]: unknown;
  }>;
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

// Access options are stored as numeric IDs in the DB
export type AccessOptionId = 0 | 1 | 2 | 3 | 4;

export interface LandingFieldInfo {
  description?: LocalizedText;
  location?: Location;
}

// Domain model - every site has an _id once it exists
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

// For site creation only - before _id is assigned
export interface CreateSiteData extends Omit<FlyingSite, '_id'> {}

export interface FlyingSiteDocument extends Omit<FlyingSite, '_id'>, Document {
  _id: number;
}

const LocationSchema = new Schema(
  {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true },
  },
  { _id: false, id: false }
);

const LocalizedTextSchema = new Schema(
  {
    bg: { type: String },
    en: { type: String },
  },
  { _id: false, id: false }
);

const GalleryImageSchema = new Schema(
  {
    path: { type: String, required: true },
    author: { type: String },
    width: { type: Number },
    height: { type: Number },
    format: { type: String },
    thumbnail: { type: String },
    small: { type: String },
    large: { type: String },
  },
  { _id: false, id: false }
);

// Deprecated legacy schema kept for backward compatibility in existing documents
const AccessOptionSchema = new Schema({
  _id: { type: Number, required: true },
  bg: { type: String },
  en: { type: String },
});

const LandingFieldInfoSchema = new Schema(
  {
    description: LocalizedTextSchema,
    location: LocationSchema,
  },
  { _id: false, id: false }
);

const FlyingSiteSchema = new Schema(
  {
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
    accessOptions: {
      type: [Number],
      validate: {
        validator: (ids: number[]) => {
          if (!Array.isArray(ids)) return false;
          const allowed = new Set([0, 1, 2, 3, 4]);
          const unique = new Set<number>();
          for (const id of ids) {
            if (!allowed.has(id)) return false;
            unique.add(id);
          }
          return unique.size === ids.length;
        },
        message: 'Invalid or duplicate access option IDs',
      },
    },
    altitude: { type: Number },
    galleryImages: [GalleryImageSchema],
    accomodations: {
      bg: [String],
      en: [String],
    },
    alternatives: {
      bg: [String],
      en: [String],
    },
    access: LocalizedTextSchema,
    landingFields: [LandingFieldInfoSchema],
    tracklogs: [String],
    localPilotsClubs: {
      bg: [String],
      en: [String],
    },
    unique: LocalizedTextSchema,
    monuments: LocalizedTextSchema,
  },
  {
    toJSON: {
      transform: (_doc: unknown, ret: Record<string, any>) => {
        try {
          const removeArrayIfEmpty = (key: string) => {
            if (Array.isArray(ret[key]) && ret[key].length === 0) delete ret[key];
          };
          const removeBilingualArraysIfEmpty = (key: string) => {
            const val = ret[key];
            if (!val) return;
            const bgEmpty = !Array.isArray(val.bg) || val.bg.length === 0;
            const enEmpty = !Array.isArray(val.en) || val.en.length === 0;
            if (bgEmpty && enEmpty) delete ret[key];
          };
          const isEmptyString = (v: unknown) => typeof v === 'string' && v.trim().length === 0;

          // Normalize accessOptions to numbers if legacy objects are present
          if (Array.isArray(ret.accessOptions)) {
            ret.accessOptions = ret.accessOptions
              .map((v: unknown) => (typeof v === 'number' ? v : (v as { _id?: number })?._id))
              .filter((id: unknown) => typeof id === 'number' && [0, 1, 2, 3, 4].includes(id));
          }

          // Remove empty arrays
          [
            'windDirection',
            'galleryImages',
            'landingFields',
            'tracklogs',
            'accessOptions',
          ].forEach(removeArrayIfEmpty);
          // Remove empty bilingual arrays containers
          ['accomodations', 'alternatives', 'localPilotsClubs'].forEach(
            removeBilingualArraysIfEmpty
          );
          // Remove access if both bg/en empty or missing
          if (ret.access) {
            const bgEmpty = ret.access.bg === undefined || isEmptyString(ret.access.bg);
            const enEmpty = ret.access.en === undefined || isEmptyString(ret.access.en);
            if (bgEmpty && enEmpty) delete ret.access;
          }
          // Remove unique if both bg/en empty or missing
          if (ret.unique) {
            const bgEmpty = ret.unique.bg === undefined || isEmptyString(ret.unique.bg);
            const enEmpty = ret.unique.en === undefined || isEmptyString(ret.unique.en);
            if (bgEmpty && enEmpty) delete ret.unique;
          }
          // Remove monuments if both bg/en empty or missing
          if (ret.monuments) {
            const bgEmpty = ret.monuments.bg === undefined || isEmptyString(ret.monuments.bg);
            const enEmpty = ret.monuments.en === undefined || isEmptyString(ret.monuments.en);
            if (bgEmpty && enEmpty) delete ret.monuments;
          }
          // Do not expose id virtual or version key
          delete ret.id;
        } catch (e) {
          console.error('toJSON transform error:', e);
          return ret;
        }
        return ret;
      },
    },
    id: false,
    versionKey: false,
  }
);

export const Site = mongoose.model<FlyingSiteDocument>('Site', FlyingSiteSchema, 'paragliding');
