// ===== UTILITY TYPES =====

import type { FlyingSite } from './sites';
import type { FORM_DEFAULTS } from '@constants';

// Form data type with empty strings instead of null/undefined for UI editing
export interface FormDataSite
  extends Omit<
    FlyingSite,
    | '_id'
    | 'location'
    | 'altitude'
    | 'access'
    | 'unique'
    | 'monuments'
    | 'accomodations'
    | 'alternatives'
    | 'localPilotsClubs'
    | 'tracklogs'
    | 'landingFields'
  > {
  location: {
    type: typeof FORM_DEFAULTS.POINT_TYPE;
    coordinates: [string, string]; // String for form inputs
  };
  altitude: string;
  access: {
    bg: string;
    en: string;
  };
  unique: {
    bg: string;
    en: string;
  };
  monuments: {
    bg: string;
    en: string;
  };
  accomodations: {
    bg: string[];
    en: string[];
  };
  alternatives: {
    bg: string[];
    en: string[];
  };
  localPilotsClubs: {
    bg: string[];
    en: string[];
  };
  tracklogs: string[];
  landingFields: FormLandingField[];
}

export interface FormLandingField {
  description: {
    bg: string;
    en: string;
  };
  location: {
    type: typeof FORM_DEFAULTS.POINT_TYPE;
    coordinates: [string, string];
  };
}

// Type for MongoDB update operations
export type MongoUpdateOperators = {
  $unset?: Record<string, 1>;
};

// Combined type for update operations
export type UpdatePayload = Partial<FlyingSite> & MongoUpdateOperators;