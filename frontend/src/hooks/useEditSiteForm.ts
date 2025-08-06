import { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (site) {
      const { _id, ...siteData } = site;
      const sanitizedData = { ...initialSiteState, ...siteData };
      setFormData(sanitizedData);
    } else {
      setFormData(initialSiteState);
    }
  }, [site]);

  const handleInputChange = (field: keyof Omit<FlyingSite, '_id'>, value: any) => {
    const processedValue = value === '' ? null : value;
    setFormData((prev) => ({ ...prev, [field]: processedValue }));
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
    value: any
  ) => {
    setFormData((prev) => {
      const currentData = prev.landingFields || { bg: [], en: [] };
      const items = [...(currentData[lang] || [])];
      const item = { ...items[index] };

      if (subField === 'description') {
        item.description = value;
      } else if (subField === 'coordinates') {
        const newCoords = [...(item.location?.coordinates || [null, null])] as [
          number | null,
          number | null
        ];
        const parsedValue = parseFloat(value.value);
        newCoords[value.index] = isNaN(parsedValue) ? null : parsedValue;
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

    const cleanedFormData = {
      ...formData,
      tracklogs: formData.tracklogs?.filter((t) => t.trim() !== ''),
      accomodations: {
        bg: formData.accomodations?.bg?.filter((a) => a.trim() !== ''),
        en: formData.accomodations?.en?.filter((a) => a.trim() !== ''),
      },
      alternatives: {
        bg: formData.alternatives?.bg?.filter((a) => a.trim() !== ''),
        en: formData.alternatives?.en?.filter((a) => a.trim() !== ''),
      },
      localPilotsClubs: {
        bg: formData.localPilotsClubs?.bg?.filter((c) => c.trim() !== ''),
        en: formData.localPilotsClubs?.en?.filter((c) => c.trim() !== ''),
      },
      landingFields: {
        bg: formData.landingFields?.bg?.filter(
          (l) =>
            l.description?.trim() !== '' ||
            (l.location?.coordinates[0] !== null && l.location?.coordinates[1] !== null)
        ),
        en: formData.landingFields?.en?.filter(
          (l) =>
            l.description?.trim() !== '' ||
            (l.location?.coordinates[0] !== null && l.location?.coordinates[1] !== null)
        ),
      },
    };

    const endpoint = site ? `/api/sites/${site._id}` : '/api/sites';
    const method = site ? 'PUT' : 'POST';

    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedFormData),
      });

      if (response.ok) {
        alert(`Site ${site ? 'updated' : 'added'} successfully!`);
      } else {
        alert(`Error ${site ? 'updating' : 'adding'} site`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert(`Error ${site ? 'updating' : 'adding'} site`);
    }
  };

  return {
    formData,
    handleInputChange,
    handleNestedChange,
    handleBilingualArrayChange,
    addBilingualArrayItem,
    removeBilingualArrayItem,
    handleLandingFieldChange,
    addLandingField,
    removeLandingField,
    handleWindDirectionChange,
    handleCoordinateChange,
    addTracklog,
    updateTracklog,
    removeTracklog,
    handleSubmit,
  };
};
