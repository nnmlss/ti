import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addSiteThunk, updateSiteThunk } from '../store/thunks/sitesThunks';
import type { AppDispatch } from '../store/store';
import { useNotificationDialog } from './useNotificationDialog';
import { useAsyncState } from './useAsyncState';
import { toFormData, toApiData, type FormDataSite } from '../utils/formDataTransforms';
import type { AccessOptionId } from '../types';
import { navigateToHome } from '../utils/navigation';
import type { FlyingSite, WindDirection } from '../types';

export const useEditSiteForm = (site?: FlyingSite) => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { showError, ...notificationDialog } = useNotificationDialog();

  // Use AsyncState for better async operation management
  const submitState = useAsyncState<FlyingSite>();

  // Initialize form with transformed data
  const form = useForm<FormDataSite>({
    defaultValues: toFormData(site),
    mode: 'onChange',
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitting },
  } = form;

  // Field arrays for dynamic sections
  const landingFields = useFieldArray({
    control,
    name: 'landingFields',
  });

  // Tracklogs are managed as a primitive string array via watch/setValue

  // For nested string arrays, we'll manage them manually without useFieldArray
  // since TypeScript doesn't recognize nested dot notation paths

  // Reset form when site changes
  useEffect(() => {
    reset(toFormData(site));
  }, [site, reset]);

  // Watch wind direction to handle checkbox changes
  const windDirections = watch('windDirection');
  const accessOptions = watch('accessOptions') as AccessOptionId[] | undefined;
  const tracklogsValues = (watch('tracklogs') as string[] | undefined) || [];

  const handleWindDirectionChange = (direction: WindDirection) => {
    const current = windDirections || [];
    const newDirections = current.includes(direction)
      ? current.filter((d) => d !== direction)
      : [...current, direction];
    setValue('windDirection', newDirections);
  };

  const handleAccessOptionChange = (optionId: number) => {
    const current = accessOptions || [];
    const exists = current.includes(optionId as AccessOptionId);
    const next = exists
      ? (current.filter((id) => id !== (optionId as AccessOptionId)) as AccessOptionId[])
      : ([...current, optionId as AccessOptionId] as AccessOptionId[]);
    setValue('accessOptions', next);
  };

  // Helper functions for bilingual arrays using setValue instead of useFieldArray
  const addBilingualArrayItem = (
    field: 'accomodations' | 'alternatives' | 'localPilotsClubs',
    lang: 'bg' | 'en'
  ) => {
    const currentValues = (watch(`${field}.${lang}`) as string[]) || [];
    setValue(`${field}.${lang}`, [...currentValues, '']);
  };

  const removeBilingualArrayItem = (
    field: 'accomodations' | 'alternatives' | 'localPilotsClubs',
    lang: 'bg' | 'en',
    index: number
  ) => {
    const currentValues = (watch(`${field}.${lang}`) as string[]) || [];
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
    setValue('tracklogs', [...tracklogsValues, '']);
  };

  const removeTracklog = (index: number) => {
    const next = tracklogsValues.filter((_, i) => i !== index);
    setValue('tracklogs', next);
  };

  const onSubmit = async (formData: FormDataSite) => {
    await submitState.execute(async () => {
      // Transform form data to API format
      const cleanedFormData = toApiData(formData, site);

      let result: FlyingSite;
      if (site) {
        const action = await dispatch(updateSiteThunk({ _id: site._id, ...cleanedFormData }));
        result = action.payload as FlyingSite;
        setShowSuccessMessage(true);
        // Auto-close after 5 seconds
        setTimeout(() => navigate(navigateToHome()), 3000);
      } else {
        const action = await dispatch(addSiteThunk(cleanedFormData));
        result = action.payload as FlyingSite;
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
    tracklogsValues,

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
