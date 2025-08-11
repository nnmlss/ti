import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddSiteMutation, useUpdateSiteMutation } from '../store/apiSlice';
import { useNotificationDialog } from './useNotificationDialog';
import type { FlyingSite, WindDirection, LocalizedText, LandingFieldInfo } from '../types';

// Type for MongoDB update operations
type MongoUpdateOperators = {
  $unset?: Record<string, 1>;
};

// Combined type for update operations
type UpdatePayload = Partial<FlyingSite> & MongoUpdateOperators;

const initialSiteState: Omit<FlyingSite, '_id'> = {
  title: { bg: '', en: '' },
  windDirection: [],
  location: { type: 'Point', coordinates: [null, null] },
  altitude: null,
  accessOptions: [],
  galleryImages: [],
  accomodations: { bg: [''], en: [''] },
  alternatives: { bg: [''], en: [''] },
  access: { bg: '', en: '' },
  landingFields: [
    {
      description: { bg: '', en: '' },
      location: { type: 'Point', coordinates: [null, null] },
    },
  ],
  tracklogs: [''],
  localPilotsClubs: { bg: [''], en: [''] },
};

export const useEditSiteForm = (site?: FlyingSite) => {
  const [formData, setFormData] = useState<Omit<FlyingSite, '_id'>>(initialSiteState);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const navigate = useNavigate();
  const { showError, ...notificationDialog } = useNotificationDialog();

  const [addSite, { isLoading: isAdding }] = useAddSiteMutation();
  const [updateSite, { isLoading: isUpdating }] = useUpdateSiteMutation();

  useEffect(() => {
    if (site) {
      const sanitizedData = {
        ...initialSiteState,
        ...site,
        // Ensure landingFields is always an array
        landingFields: Array.isArray(site.landingFields)
          ? site.landingFields
          : initialSiteState.landingFields,
      };
      setFormData(sanitizedData);
    } else {
      setFormData(initialSiteState);
    }
  }, [site]);

  // This handler is specifically for the altitude field.
  // The previous generic `handleInputChange` was not type-safe and could introduce bugs
  // by assigning string values to fields expecting numbers.
  const handleAltitudeChange = (value: string) => {
    const altitude = parseInt(value, 10);
    setFormData((prev) => {
      const newData = { ...prev };
      if (!isNaN(altitude) && altitude >= 0) {
        newData.altitude = altitude;
      } else {
        delete newData.altitude;
      }
      return newData;
    });
  };

  const handleNestedChange = (
    field: 'title' | 'access',
    subField: 'bg' | 'en',
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: { ...prev[field], [subField]: value } as LocalizedText,
    }));
  };

  const handleBilingualArrayChange = (
    field: 'accomodations' | 'alternatives' | 'localPilotsClubs',
    lang: 'bg' | 'en',
    index: number,
    value: string
  ) => {
    setFormData((prev) => {
      const currentData = prev[field] || { bg: [], en: [] };
      const items = [...(currentData[lang] || [])];
      items[index] = value;
      return { ...prev, [field]: { ...currentData, [lang]: items } };
    });
  };

  const addBilingualArrayItem = (
    field: 'accomodations' | 'alternatives' | 'localPilotsClubs',
    lang: 'bg' | 'en'
  ) => {
    setFormData((prev) => {
      const currentData = prev[field] || { bg: [], en: [] };
      const items = [...(currentData[lang] || []), ''];
      return { ...prev, [field]: { ...currentData, [lang]: items } };
    });
  };

  const removeBilingualArrayItem = (
    field: 'accomodations' | 'alternatives' | 'localPilotsClubs',
    lang: 'bg' | 'en',
    index: number
  ) => {
    setFormData((prev) => {
      const currentData = prev[field] || { bg: [], en: [] };
      const items = [...(currentData[lang] || [])];
      items.splice(index, 1);
      return { ...prev, [field]: { ...currentData, [lang]: items } };
    });
  };

  const handleLandingFieldDescription = (lang: 'bg' | 'en', index: number, value: string) => {
    setFormData((prev) => {
      const currentFields = [...(prev.landingFields || [])];
      const field = { ...currentFields[index] };
      field.description = field.description || { bg: '', en: '' };
      field.description[lang] = value;
      currentFields[index] = field;
      return { ...prev, landingFields: currentFields };
    });
  };

  const handleLandingFieldCoordinates = (
    index: number,
    coordinateIndex: 0 | 1,
    value: number
  ) => {
    setFormData((prev) => {
      const currentFields = [...(prev.landingFields || [])];
      const field = { ...currentFields[index] };
      const newCoords = [...(field.location?.coordinates || [null, null])] as [
        number | null,
        number | null
      ];
      newCoords[coordinateIndex] = isNaN(value) ? null : value;
      field.location = { type: 'Point', coordinates: newCoords };
      currentFields[index] = field;
      return { ...prev, landingFields: currentFields };
    });
  };

  const addLandingField = () => {
    setFormData((prev) => ({
      ...prev,
      landingFields: [
        ...(prev.landingFields || []),
        {
          description: { bg: '', en: '' },
          location: { type: 'Point', coordinates: [null, null] },
        },
      ],
    }));
  };

  const removeLandingField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      landingFields: prev.landingFields?.filter((_, i) => i !== index),
    }));
  };

  const handleWindDirectionChange = (direction: WindDirection) => {
    setFormData((prev) => ({
      ...prev,
      windDirection: prev.windDirection.includes(direction)
        ? prev.windDirection.filter((d) => d !== direction)
        : [...prev.windDirection, direction],
    }));
  };

  const handleAccessOptionChange = (optionId: number, bg: string, en: string) => {
    setFormData((prev) => {
      const currentOptions = prev.accessOptions || [];
      const existingIndex = currentOptions.findIndex((option) => option._id === optionId);

      if (existingIndex >= 0) {
        // Remove if already selected
        return {
          ...prev,
          accessOptions: currentOptions.filter((option) => option._id !== optionId),
        };
      } else {
        // Add if not selected
        return {
          ...prev,
          accessOptions: [...currentOptions, { _id: optionId, bg: [bg], en: [en] }],
        };
      }
    });
  };

  const handleCoordinateChange = (index: 0 | 1, value: string) => {
    const newCoordinates = [...formData.location.coordinates] as [number | null, number | null];
    const parsedValue = parseFloat(value);
    newCoordinates[index] = isNaN(parsedValue) ? null : parsedValue;
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        coordinates: newCoordinates,
      },
    }));
  };

  const addTracklog = () => {
    setFormData((prev) => ({
      ...prev,
      tracklogs: [...(prev.tracklogs || []), ''],
    }));
  };

  const updateTracklog = (index: number, value: string) => {
    const newTracklogs = [...(formData.tracklogs || [])];
    newTracklogs[index] = value;
    setFormData((prev) => ({ ...prev, tracklogs: newTracklogs }));
  };

  const removeTracklog = (index: number) => {
    const newTracklogs = [...(formData.tracklogs || [])];
    newTracklogs.splice(index, 1);
    setFormData((prev) => ({ ...prev, tracklogs: newTracklogs }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Start with mandatory fields
    const cleanedFormData = {
      title: formData.title,
      location: formData.location,
      windDirection: formData.windDirection,
      accessOptions: formData.accessOptions,
    } as UpdatePayload;

    // Handle altitude field
    if (typeof formData.altitude === 'number' && formData.altitude >= 0) {
      cleanedFormData.altitude = formData.altitude;
    } else if (site?.altitude !== undefined) {
      // If editing and altitude exists in DB but should be removed, use $unset
      cleanedFormData['$unset'] = { altitude: 1 };
    }

    // Handle tracklogs field
    const filteredTracklogs = (formData.tracklogs ?? []).filter((t) => t.trim() !== '');
    if (filteredTracklogs.length > 0) {
      cleanedFormData.tracklogs = filteredTracklogs;
    } else if (site?.tracklogs?.length) {
      // If editing and tracklogs exist in DB but should be removed, use $unset
      cleanedFormData['$unset'] = { ...cleanedFormData['$unset'], tracklogs: 1 };
    }

    // Handle bilingual arrays (accomodations, alternatives, localPilotsClubs)
    const bilingualFields = ['accomodations', 'alternatives', 'localPilotsClubs'] as const;
    bilingualFields.forEach((field) => {
      const bgFiltered = (formData[field]?.bg ?? []).filter((item) => item.trim() !== '');
      const enFiltered = (formData[field]?.en ?? []).filter((item) => item.trim() !== '');

      if (bgFiltered.length > 0 || enFiltered.length > 0) {
        cleanedFormData[field] = {};
        if (bgFiltered.length > 0) {
          cleanedFormData[field].bg = bgFiltered;
        }
        if (enFiltered.length > 0) {
          cleanedFormData[field].en = enFiltered;
        }
      } else if (site?.[field]?.bg?.length || site?.[field]?.en?.length) {
        // If editing and field exists in DB but should be removed, use $unset
        cleanedFormData['$unset'] = { ...cleanedFormData['$unset'], [field]: 1 };
      }
    });

    // Handle access field (LocalizedText)
    const bgAccess = formData.access?.bg?.trim();
    const enAccess = formData.access?.en?.trim();

    if (bgAccess || enAccess) {
      cleanedFormData.access = {};
      if (bgAccess) {
        cleanedFormData.access.bg = bgAccess;
      }
      if (enAccess) {
        cleanedFormData.access.en = enAccess;
      }
    } else if (site?.access?.bg || site?.access?.en) {
      // If editing and access exists in DB but should be removed, use $unset
      cleanedFormData['$unset'] = { ...cleanedFormData['$unset'], access: 1 };
    }

    // Handle landing fields
    const cleanLandingField = (
      field: LandingFieldInfo,
      existingField?: LandingFieldInfo
    ): Partial<LandingFieldInfo> & { $unset?: Record<string, 1> } => {
      const cleaned: Partial<LandingFieldInfo> & { $unset?: Record<string, 1> } = {};

      // Handle description
      const bgDescription = field.description?.bg?.trim();
      const enDescription = field.description?.en?.trim();
      if (bgDescription || enDescription) {
        cleaned.description = {};
        if (bgDescription) cleaned.description.bg = bgDescription;
        if (enDescription) cleaned.description.en = enDescription;
      } else if (existingField?.description) {
        cleaned.$unset = { ...cleaned.$unset, description: 1 };
      }

      // Handle location
      if (field.location?.coordinates[0] !== null && field.location?.coordinates[1] !== null) {
        cleaned.location = field.location;
      } else if (existingField?.location) {
        cleaned.$unset = { ...cleaned.$unset, location: 1 };
      }

      return cleaned;
    };

    const cleanLandingFields = (
      fields: LandingFieldInfo[],
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
      formData.landingFields || [],
      site?.landingFields
    );

    if (cleanedLandingFields.length > 0) {
      cleanedFormData.landingFields = cleanedLandingFields;
    } else if (site?.landingFields?.length) {
      cleanedFormData['$unset'] = { ...cleanedFormData['$unset'], landingFields: 1 };
    }

    try {
      if (site) {
        await updateSite({ _id: site._id, ...cleanedFormData }).unwrap();
        setShowSuccessMessage(true);
        // Auto-close after 3 seconds
        setTimeout(() => navigate('/'), 5000);
      } else {
        await addSite(cleanedFormData).unwrap();
        setShowSuccessMessage(true);
        // Auto-close after 3 seconds
        setTimeout(() => navigate('/'), 3000);
      }
    } catch (error) {
      console.error('Failed to save the site:', error);
      showError('Error saving site. Please try again.');
    }
  };

  return {
    formData,
    isSubmitting: isAdding || isUpdating,
    showSuccessMessage,
    handleAltitudeChange,
    handleNestedChange,
    handleBilingualArrayChange,
    addBilingualArrayItem,
    removeBilingualArrayItem,
    handleLandingFieldDescription,
    handleLandingFieldCoordinates,
    addLandingField,
    removeLandingField,
    handleWindDirectionChange,
    handleAccessOptionChange,
    handleCoordinateChange,
    addTracklog,
    updateTracklog,
    removeTracklog,
    handleSubmit,
    notificationDialog,
  };
};
