import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAddSiteMutation, useUpdateSiteMutation } from '../store/apiSlice';
import { useNotificationDialog } from './useNotificationDialog';
import { useAsyncState } from './useAsyncState';
import { toFormData, toApiData, type FormDataSite } from '../utils/formDataTransforms';
import { navigateToHome } from '../utils/navigation';
import type { FlyingSite, WindDirection } from '../types';

export const useEditSiteForm = (site?: FlyingSite) => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const navigate = useNavigate();
  const { showError, ...notificationDialog } = useNotificationDialog();

  // Use AsyncState for better async operation management
  const submitState = useAsyncState<FlyingSite>();
  
  const [addSite] = useAddSiteMutation();
  const [updateSite] = useUpdateSiteMutation();

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
  });

  // For nested string arrays, we'll manage them manually without useFieldArray
  // since TypeScript doesn't recognize nested dot notation paths

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

  // Helper functions for bilingual arrays using setValue instead of useFieldArray
  const addBilingualArrayItem = (
    field: 'accomodations' | 'alternatives' | 'localPilotsClubs',
    lang: 'bg' | 'en'
  ) => {
    const currentValues = watch(`${field}.${lang}`) as string[] || [];
    setValue(`${field}.${lang}`, [...currentValues, '']);
  };

  const removeBilingualArrayItem = (
    field: 'accomodations' | 'alternatives' | 'localPilotsClubs',
    lang: 'bg' | 'en',
    index: number
  ) => {
    const currentValues = watch(`${field}.${lang}`) as string[] || [];
    const newValues = currentValues.filter((_, i) => i !== index);
    setValue(`${field}.${lang}`, newValues);
  };

  // Landing field helpers
  const addLandingField = () => {
    landingFields.append({
      description: { bg: '', en: '' },
      location: { type: 'Point', coordinates: ['', ''] },
    });
  };

  const removeLandingField = (index: number) => {
    landingFields.remove(index);
  };

  // Tracklog helpers
  const addTracklog = () => {
    tracklogsFields.append('');
  };

  const removeTracklog = (index: number) => {
    tracklogsFields.remove(index);
  };

  const onSubmit = async (formData: FormDataSite) => {
    await submitState.execute(async () => {
      // Transform form data to API format
      const cleanedFormData = toApiData(formData, site);

      let result: FlyingSite;
      if (site) {
        result = await updateSite({ _id: site._id, ...cleanedFormData }).unwrap();
        setShowSuccessMessage(true);
        // Auto-close after 5 seconds
        setTimeout(() => navigate(navigateToHome()), 5000);
      } else {
        result = await addSite(cleanedFormData).unwrap();
        setShowSuccessMessage(true);
        // Auto-close after 3 seconds
        setTimeout(() => navigate(navigateToHome()), 3000);
      }
      
      return result;
    });

    // Handle errors through submitState.error
    if (submitState.isError) {
      showError(submitState.error || 'Error saving site. Please try again.');
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
    isSubmitting: isSubmitting || submitState.isLoading,
    showSuccessMessage,
    submitState,
    
    // Field arrays (only for actual useFieldArray hooks)
    landingFields,
    tracklogsFields,
    
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