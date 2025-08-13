import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addSiteThunk, updateSiteThunk } from '../store/thunks/sitesThunks';
import type { AppDispatch } from '../store/store';
import { selectAllSitesLoadState } from '../store/slices/allSitesSlice';
import { toFormData, toApiData, type FormDataSite } from '../utils/formDataTransforms';
import type { AccessOptionId } from '../types';
import { navigateToHome } from '../utils/navigation';
import type { FlyingSite, WindDirection } from '../types';

export const useEditSiteForm = (site?: FlyingSite, onModalClose?: () => void) => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const loadState = useSelector(selectAllSitesLoadState);

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
    setError,
    setFocus,
    formState: { isSubmitting, isValid },
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
    // Transform form data to API format
    const cleanedFormData = toApiData(formData, site);

    const handleSuccess = () => {
      // Success callback - show success message and close modal after 3s
      setShowSuccessMessage(true);
      setTimeout(() => {
        if (onModalClose) {
          onModalClose(); // Use modal's own close function
        } else {
          navigate(navigateToHome()); // Fallback for non-modal usage
        }
      }, 3000);
    };

    const handleError = (errorMessage: string) => {
      handleValidationError(errorMessage);
    };

    try {
      if (site) {
        await dispatch(updateSiteThunk({ _id: site._id, ...cleanedFormData })).unwrap();
      } else {
        await dispatch(addSiteThunk(cleanedFormData)).unwrap();
      }
      // Success
      handleSuccess();
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : 'An unexpected error occurred';
      
      // Store the success callback globally for retry
      (window as unknown as { __retrySuccessCallback?: () => void }).__retrySuccessCallback = handleSuccess;
      
      handleError(errorMessage);
    }
  };

  const onInvalid = (errors: Record<string, unknown>) => {
    // Find first error field and focus it
    const firstErrorField = Object.keys(errors)[0];
    if (firstErrorField) {
      setFocus(firstErrorField as keyof FormDataSite);
    }
  };

  const handleValidationError = (errorMessage: string) => {
    // Set form field errors
    if (errorMessage.includes('Bulgarian title')) {
      setError('title.bg', { type: 'manual', message: errorMessage });
      setTimeout(() => {
        const element = document.getElementById('title-bg');
        if (element) {
          element.focus();
        }
      }, 100);
    } else if (errorMessage.includes('English title')) {
      setError('title.en', { type: 'manual', message: errorMessage });
      setTimeout(() => {
        const element = document.getElementById('title-en');
        if (element) {
          element.focus();
        }
      }, 100);
    } else if (errorMessage.includes('Location is required')) {
      setError('location.coordinates.0', { type: 'manual', message: errorMessage });
      setTimeout(() => {
        const element = document.getElementById('location-longitude');
        if (element) {
          element.focus();
        }
      }, 100);
    }
    
    // Error is now handled by Redux error middleware
  };

  return {
    // Form controls
    form,
    control,
    handleSubmit: handleSubmit(onSubmit, onInvalid),
    watch,
    setValue,

    // State
    isSubmitting: isSubmitting || loadState.status === 'pending',
    isFormValid: isValid,
    showSuccessMessage,

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
  };
};
