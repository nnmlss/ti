import type { FlyingSite, LocalizedText, LandingFieldInfo } from '../types';

// Form data type with empty strings instead of null/undefined for UI editing
export interface FormDataSite extends Omit<FlyingSite, '_id' | 'location' | 'altitude' | 'access' | 'accomodations' | 'alternatives' | 'localPilotsClubs' | 'tracklogs' | 'landingFields'> {
  location: {
    type: 'Point';
    coordinates: [string, string]; // String for form inputs
  };
  altitude: string;
  access: {
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
    type: 'Point';
    coordinates: [string, string];
  };
}

// Type for MongoDB update operations
export type MongoUpdateOperators = {
  $unset?: Record<string, 1>;
};

// Combined type for update operations
export type UpdatePayload = Partial<FlyingSite> & MongoUpdateOperators;

const initialFormState: FormDataSite = {
  title: { bg: '', en: '' },
  windDirection: [],
  location: { type: 'Point', coordinates: ['', ''] },
  altitude: '',
  accessOptions: [],
  galleryImages: [],
  accomodations: { bg: [''], en: [''] },
  alternatives: { bg: [''], en: [''] },
  access: { bg: '', en: '' },
  landingFields: [
    {
      description: { bg: '', en: '' },
      location: { type: 'Point', coordinates: ['', ''] },
    },
  ],
  tracklogs: [''],
  localPilotsClubs: { bg: [''], en: [''] },
};

/**
 * Transform API data (with nulls) to form data (with empty strings)
 * This makes the data suitable for editing in form inputs
 */
export function toFormData(site?: FlyingSite): FormDataSite {
  if (!site) {
    return initialFormState;
  }

  const transformLocalizedText = (text?: LocalizedText): { bg: string; en: string } => ({
    bg: text?.bg || '',
    en: text?.en || '',
  });

  const transformBilingualArray = (data?: { bg?: string[]; en?: string[] }): { bg: string[]; en: string[] } => ({
    bg: data?.bg?.length ? data.bg : [''],
    en: data?.en?.length ? data.en : [''],
  });

  const transformLandingFields = (fields?: LandingFieldInfo[]): FormLandingField[] => {
    if (!fields?.length) {
      return [
        {
          description: { bg: '', en: '' },
          location: { type: 'Point', coordinates: ['', ''] },
        },
      ];
    }

    return fields.map(field => ({
      description: transformLocalizedText(field.description),
      location: {
        type: 'Point' as const,
        coordinates: [
          field.location?.coordinates[0]?.toString() || '',
          field.location?.coordinates[1]?.toString() || ''
        ] as [string, string],
      },
    }));
  };

  return {
    title: transformLocalizedText(site.title),
    windDirection: [...site.windDirection],
    location: {
      type: 'Point' as const,
      coordinates: [
        site.location.coordinates[0]?.toString() || '',
        site.location.coordinates[1]?.toString() || ''
      ] as [string, string],
    },
    altitude: site.altitude?.toString() || '',
    accessOptions: [...site.accessOptions],
    galleryImages: site.galleryImages ? [...site.galleryImages] : [],
    accomodations: transformBilingualArray(site.accomodations),
    alternatives: transformBilingualArray(site.alternatives),
    access: transformLocalizedText(site.access),
    landingFields: transformLandingFields(site.landingFields),
    tracklogs: site.tracklogs?.length ? [...site.tracklogs] : [''],
    localPilotsClubs: transformBilingualArray(site.localPilotsClubs),
  };
}

/**
 * Transform form data (with empty strings) to API data (with nulls/$unset)
 * This prepares the data for backend MongoDB operations
 */
export function toApiData(formData: FormDataSite, originalSite?: FlyingSite): UpdatePayload {
  const cleanedFormData: UpdatePayload = {
    title: formData.title,
    windDirection: formData.windDirection,
    accessOptions: formData.accessOptions,
    location: {
      type: 'Point',
      coordinates: [
        formData.location.coordinates[0] ? parseFloat(formData.location.coordinates[0]) : null,
        formData.location.coordinates[1] ? parseFloat(formData.location.coordinates[1]) : null,
      ] as [number | null, number | null],
    },
  };

  // Handle altitude field
  const altitudeValue = formData.altitude ? parseInt(formData.altitude, 10) : null;
  if (altitudeValue && altitudeValue >= 0 && !isNaN(altitudeValue)) {
    cleanedFormData.altitude = altitudeValue;
  } else if (originalSite?.altitude !== undefined) {
    // If editing and altitude exists in DB but should be removed, use $unset
    cleanedFormData.$unset = { altitude: 1 };
  }

  // Handle tracklogs field
  const filteredTracklogs = formData.tracklogs.filter((t) => t.trim() !== '');
  if (filteredTracklogs.length > 0) {
    cleanedFormData.tracklogs = filteredTracklogs;
  } else if (originalSite?.tracklogs?.length) {
    // If editing and tracklogs exist in DB but should be removed, use $unset
    cleanedFormData.$unset = { ...cleanedFormData.$unset, tracklogs: 1 };
  }

  // Handle bilingual arrays (accomodations, alternatives, localPilotsClubs)
  const bilingualFields = ['accomodations', 'alternatives', 'localPilotsClubs'] as const;
  bilingualFields.forEach((field) => {
    const bgFiltered = formData[field].bg.filter((item) => item.trim() !== '');
    const enFiltered = formData[field].en.filter((item) => item.trim() !== '');

    if (bgFiltered.length > 0 || enFiltered.length > 0) {
      cleanedFormData[field] = {};
      if (bgFiltered.length > 0) {
        cleanedFormData[field]!.bg = bgFiltered;
      }
      if (enFiltered.length > 0) {
        cleanedFormData[field]!.en = enFiltered;
      }
    } else if (originalSite?.[field]?.bg?.length || originalSite?.[field]?.en?.length) {
      // If editing and field exists in DB but should be removed, use $unset
      cleanedFormData.$unset = { ...cleanedFormData.$unset, [field]: 1 };
    }
  });

  // Handle access field (LocalizedText)
  const bgAccess = formData.access.bg.trim();
  const enAccess = formData.access.en.trim();

  if (bgAccess || enAccess) {
    cleanedFormData.access = {};
    if (bgAccess) {
      cleanedFormData.access.bg = bgAccess;
    }
    if (enAccess) {
      cleanedFormData.access.en = enAccess;
    }
  } else if (originalSite?.access?.bg || originalSite?.access?.en) {
    // If editing and access exists in DB but should be removed, use $unset
    cleanedFormData.$unset = { ...cleanedFormData.$unset, access: 1 };
  }

  // Handle landing fields
  const cleanLandingField = (
    field: FormLandingField,
    existingField?: LandingFieldInfo
  ): Partial<LandingFieldInfo> & { $unset?: Record<string, 1> } => {
    const cleaned: Partial<LandingFieldInfo> & { $unset?: Record<string, 1> } = {};

    // Handle description
    const bgDescription = field.description.bg.trim();
    const enDescription = field.description.en.trim();
    if (bgDescription || enDescription) {
      cleaned.description = {};
      if (bgDescription) cleaned.description.bg = bgDescription;
      if (enDescription) cleaned.description.en = enDescription;
    } else if (existingField?.description) {
      cleaned.$unset = { ...cleaned.$unset, description: 1 };
    }

    // Handle location
    const lng = field.location.coordinates[0] ? parseFloat(field.location.coordinates[0]) : null;
    const lat = field.location.coordinates[1] ? parseFloat(field.location.coordinates[1]) : null;
    
    if (lng !== null && lat !== null && !isNaN(lng) && !isNaN(lat)) {
      cleaned.location = {
        type: 'Point',
        coordinates: [lng, lat],
      };
    } else if (existingField?.location) {
      cleaned.$unset = { ...cleaned.$unset, location: 1 };
    }

    return cleaned;
  };

  const cleanLandingFields = (
    fields: FormLandingField[],
    existingFields?: LandingFieldInfo[]
  ) => {
    return fields
      .map((field, index) => cleanLandingField(field, existingFields?.[index]))
      .filter((field) => {
        return (
          Object.keys(field).length > 0 &&
          (field.description || field.location || field.$unset)
        );
      });
  };

  const cleanedLandingFields = cleanLandingFields(
    formData.landingFields,
    originalSite?.landingFields
  );

  if (cleanedLandingFields.length > 0) {
    cleanedFormData.landingFields = cleanedLandingFields as LandingFieldInfo[];
  } else if (originalSite?.landingFields?.length) {
    cleanedFormData.$unset = { ...cleanedFormData.$unset, landingFields: 1 };
  }

  return cleanedFormData;
}

export { initialFormState };