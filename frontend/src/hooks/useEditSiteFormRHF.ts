import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAddSiteMutation, useUpdateSiteMutation } from '../store/apiSlice';
import { useNotificationDialog } from './useNotificationDialog';
import { toFormData, toApiData, type FormDataSite } from '../utils/formDataTransforms';
import type { FlyingSite, WindDirection } from '../types';

export const useEditSiteFormRHF = (site?: FlyingSite) => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const navigate = useNavigate();
  const { showError, ...notificationDialog } = useNotificationDialog();

  const [addSite, { isLoading: isAdding }] = useAddSiteMutation();
  const [updateSite, { isLoading: isUpdating }] = useUpdateSiteMutation();

  // Initialize form with transformed data
  const form = useForm<FormDataSite>({
    defaultValues: toFormData(site),
    mode: 'onChange',
  });

  const { control, handleSubmit, reset, watch, setValue, formState: { isSubmitting } } = form;

  // Field arrays for dynamic sections
  const landingFields = useFieldArray({
    control,
    name: 'landingFields',
  });

  const tracklogsFields = useFieldArray({
    control,
    name: 'tracklogs',
  } as any);

  const accomodationsBg = useFieldArray({
    control,
    name: 'accomodations.bg',
  } as any);

  const accomodationsEn = useFieldArray({
    control,
    name: 'accomodations.en',
  } as any);

  const alternativesBg = useFieldArray({
    control,
    name: 'alternatives.bg',
  } as any);

  const alternativesEn = useFieldArray({
    control,
    name: 'alternatives.en',
  } as any);

  const localPilotsClubsBg = useFieldArray({
    control,
    name: 'localPilotsClubs.bg',
  } as any);

  const localPilotsClubsEn = useFieldArray({
    control,
    name: 'localPilotsClubs.en',
  } as any);

  // Reset form when site changes
  useEffect(() => {
    reset(toFormData(site));
  }, [site, reset]);

  // Watch wind direction to handle checkbox changes
  const windDirections = watch('windDirection');
  const accessOptions = watch('accessOptions');

  const handleWindDirectionChange = (direction: WindDirection) => {
    const current = windDirections || [];
    const newDirections = current.includes(direction)
      ? current.filter((d) => d !== direction)
      : [...current, direction];
    setValue('windDirection', newDirections);
  };

  const handleAccessOptionChange = (optionId: number, bg: string, en: string) => {
    const current = accessOptions || [];
    const existingIndex = current.findIndex((option) => option._id === optionId);

    if (existingIndex >= 0) {
      // Remove if already selected
      setValue('accessOptions', current.filter((option) => option._id !== optionId));
    } else {
      // Add if not selected
      setValue('accessOptions', [...current, { _id: optionId, bg: [bg], en: [en] }]);
    }
  };

  // Helper functions for bilingual arrays
  const addBilingualArrayItem = (
    field: 'accomodations' | 'alternatives' | 'localPilotsClubs',
    lang: 'bg' | 'en'
  ) => {
    if (field === 'accomodations') {
      if (lang === 'bg') {
        accomodationsBg.append('' as any);
      } else {
        accomodationsEn.append('' as any);
      }
    } else if (field === 'alternatives') {
      if (lang === 'bg') {
        alternativesBg.append('' as any);
      } else {
        alternativesEn.append('' as any);
      }
    } else if (field === 'localPilotsClubs') {
      if (lang === 'bg') {
        localPilotsClubsBg.append('' as any);
      } else {
        localPilotsClubsEn.append('' as any);
      }
    }
  };

  const removeBilingualArrayItem = (
    field: 'accomodations' | 'alternatives' | 'localPilotsClubs',
    lang: 'bg' | 'en',
    index: number
  ) => {
    if (field === 'accomodations') {
      if (lang === 'bg') {
        accomodationsBg.remove(index);
      } else {
        accomodationsEn.remove(index);
      }
    } else if (field === 'alternatives') {
      if (lang === 'bg') {
        alternativesBg.remove(index);
      } else {
        alternativesEn.remove(index);
      }
    } else if (field === 'localPilotsClubs') {
      if (lang === 'bg') {
        localPilotsClubsBg.remove(index);
      } else {
        localPilotsClubsEn.remove(index);
      }
    }
  };

  // Landing field helpers
  const addLandingField = () => {
    landingFields.append({
      description: { bg: '', en: '' },
      location: { type: 'Point', coordinates: ['', ''] },
    } as any);
  };

  const removeLandingField = (index: number) => {
    landingFields.remove(index);
  };

  // Tracklog helpers
  const addTracklog = () => {
    tracklogsFields.append('' as any);
  };

  const removeTracklog = (index: number) => {
    tracklogsFields.remove(index);
  };

  const onSubmit = async (formData: FormDataSite) => {
    try {
      // Transform form data to API format
      const cleanedFormData = toApiData(formData, site);

      if (site) {
        await updateSite({ _id: site._id, ...cleanedFormData }).unwrap();
        setShowSuccessMessage(true);
        // Auto-close after 5 seconds
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
    // Form controls
    form,
    control,
    handleSubmit: handleSubmit(onSubmit),
    watch,
    setValue,
    
    // State
    isSubmitting: isSubmitting || isAdding || isUpdating,
    showSuccessMessage,
    
    // Field arrays
    landingFields,
    tracklogsFields,
    accomodationsBg,
    accomodationsEn,
    alternativesBg,
    alternativesEn,
    localPilotsClubsBg,
    localPilotsClubsEn,
    
    // Helper functions
    handleWindDirectionChange,
    handleAccessOptionChange,
    addBilingualArrayItem,
    removeBilingualArrayItem,
    addLandingField,
    removeLandingField,
    addTracklog,
    removeTracklog,
    
    // Other
    notificationDialog,
  };
};