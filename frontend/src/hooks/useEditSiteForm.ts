import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddSiteMutation, useUpdateSiteMutation } from '../store/apiSlice';
import { useNotificationDialog } from './useNotificationDialog';
import type { FlyingSite, WindDirection, LocalizedText } from '../types';

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
  landingFields: {
    bg: [{ description: '', location: { type: 'Point', coordinates: [null, null] } }],
    en: [{ description: '', location: { type: 'Point', coordinates: [null, null] } }],
  },
  tracklogs: [''],
  localPilotsClubs: { bg: [''], en: [''] },
};

export const useEditSiteForm = (site?: FlyingSite) => {
  const [formData, setFormData] = useState<Omit<FlyingSite, '_id'>>(initialSiteState);
  const navigate = useNavigate();
  const { showSuccess, showError, ...notificationDialog } = useNotificationDialog();

  const [addSite, { isLoading: isAdding }] = useAddSiteMutation();
  const [updateSite, { isLoading: isUpdating }] = useUpdateSiteMutation();

  useEffect(() => {
    if (site) {
      const sanitizedData = { ...initialSiteState, ...site };
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
    setFormData((prev) => ({
      ...prev,
      altitude: isNaN(altitude) ? null : altitude,
    }));
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

  const handleLandingFieldChange = (
    lang: 'bg' | 'en',
    index: number,
    subField: 'description' | 'coordinates',
    value: string | number,
    coordinateIndex?: 0 | 1
  ) => {
    setFormData((prev) => {
      const currentData = prev.landingFields || { bg: [], en: [] };
      const items = [...(currentData[lang] || [])];
      const item = { ...items[index] };

      if (subField === 'description' && typeof value === 'string') {
        item.description = value;
      } else if (
        subField === 'coordinates' &&
        (coordinateIndex === 0 || coordinateIndex === 1)
      ) {
        const newCoords = [...(item.location?.coordinates || [null, null])] as [
          number | null,
          number | null
        ];
        const parsedValue = parseFloat(String(value));
        newCoords[coordinateIndex] = isNaN(parsedValue) ? null : parsedValue;
        item.location = { type: 'Point', coordinates: newCoords };
      }
      items[index] = item;
      return { ...prev, landingFields: { ...currentData, [lang]: items } };
    });
  };

  const addLandingField = (lang: 'bg' | 'en') => {
    setFormData((prev) => {
      const currentData = prev.landingFields || { bg: [], en: [] };
      const items = [
        ...(currentData[lang] || []),
        { description: '', location: { type: 'Point', coordinates: [null, null] } },
      ];
      return { ...prev, landingFields: { ...currentData, [lang]: items } };
    });
  };

  const removeLandingField = (lang: 'bg' | 'en', index: number) => {
    setFormData((prev) => {
      const currentData = prev.landingFields || { bg: [], en: [] };
      const items = [...(currentData[lang] || [])];
      items.splice(index, 1);
      return { ...prev, landingFields: { ...currentData, [lang]: items } };
    });
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

    // Clean the form data before submitting
    const cleanedFormData = {
      ...formData,
      tracklogs: (formData.tracklogs ?? []).filter((t) => t.trim() !== ''),
      accomodations: {
        bg: (formData.accomodations?.bg ?? []).filter((a) => a.trim() !== ''),
        en: (formData.accomodations?.en ?? []).filter((a) => a.trim() !== ''),
      },
      alternatives: {
        bg: (formData.alternatives?.bg ?? []).filter((a) => a.trim() !== ''),
        en: (formData.alternatives?.en ?? []).filter((a) => a.trim() !== ''),
      },
      // Add more cleaning logic as needed, e.g., for landingFields
    };

    try {
      if (site) {
        await updateSite({ _id: site._id, ...cleanedFormData }).unwrap();
        showSuccess('Успешна редакция на място за летене!', undefined, () => navigate('/'));
      } else {
        await addSite(cleanedFormData).unwrap();
        showSuccess('Добавено ново място за летене!', undefined, () => navigate('/'));
      }
    } catch (error) {
      console.error('Failed to save the site:', error);
      showError('Error saving site. Please try again.');
    }
  };

  return {
    formData,
    isSubmitting: isAdding || isUpdating,
    handleAltitudeChange,
    handleNestedChange,
    handleBilingualArrayChange,
    addBilingualArrayItem,
    removeBilingualArrayItem,
    handleLandingFieldChange,
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
