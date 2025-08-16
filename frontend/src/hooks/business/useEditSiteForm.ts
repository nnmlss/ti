import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addSiteThunk, updateSiteThunk } from '@store/thunks/sitesThunks';
import { uploadImageThunk, deleteImageThunk } from '@store/thunks/imageThunks';
import type { AppDispatch } from '@store/store';
import { selectAllSitesLoadState } from '@store/slices/allSitesSlice';
import { toFormData, toApiData, type FormDataSite } from '@utils/formDataTransforms';
import { TIMEOUTS } from '@constants';
import type { AccessOptionId, GalleryImage } from '@types';
import { navigateToHome } from '@utils/navigation';
import type { FlyingSite, WindDirection } from '@types';

export const useEditSiteForm = (site?: FlyingSite, onModalClose?: () => void) => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [galleryError, setGalleryError] = useState<string | null>(null);
  const [imagesToDelete, setImagesToDelete] = useState<Set<string>>(new Set());
  const [newlyUploadedImages, setNewlyUploadedImages] = useState<Set<string>>(new Set());
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
  const galleryImages = (watch('galleryImages') as GalleryImage[] | undefined) || [];

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

  // Gallery management functions
  const handleImageUpload = async (files: File[]) => {
    setIsUploadingImages(true);
    setGalleryError(null);

    try {
      const uploadPromises = files.map((file) => dispatch(uploadImageThunk(file)).unwrap());
      const uploadResults = await Promise.all(uploadPromises);

      // Add uploaded images to the form
      const newImages: GalleryImage[] = uploadResults.map((result) => ({
        path: result.image.path,
        author: '',
        width: result.image.width,
        height: result.image.height,
        format: result.image.format,
        thumbnail: result.image.thumbnail,
        small: result.image.small,
        large: result.image.large,
      }));

      setValue('galleryImages', [...galleryImages, ...newImages]);

      // Track newly uploaded images
      const newImagePaths = new Set([
        ...newlyUploadedImages,
        ...newImages.map((img) => img.path),
      ]);
      setNewlyUploadedImages(newImagePaths);
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : 'Failed to upload images';
      setGalleryError(errorMessage);
    } finally {
      setIsUploadingImages(false);
    }
  };

  const handleImageDelete = (imagePath: string) => {
    // Toggle delete status - don't actually remove from form data
    setImagesToDelete((prev) => {
      const next = new Set(prev);
      if (next.has(imagePath)) {
        next.delete(imagePath); // Restore if already marked
      } else {
        next.add(imagePath); // Mark for deletion
      }
      return next;
    });
  };

  const handleImageUpdate = (imagePath: string, updates: Partial<GalleryImage>) => {
    const updatedImages = galleryImages.map((img) =>
      img.path === imagePath ? { ...img, ...updates } : img
    );
    setValue('galleryImages', updatedImages);
  };

  const onSubmit = async (formData: FormDataSite) => {
    // Filter out images marked for deletion
    const filteredFormData = {
      ...formData,
      galleryImages:
        formData.galleryImages?.filter((img) => !imagesToDelete.has(img.path)) || [],
    };

    // Delete ALL files that were marked for deletion (both new and existing)
    const filesToDelete = Array.from(imagesToDelete);

    if (filesToDelete.length > 0) {
      try {
        await Promise.all(
          filesToDelete.map((imagePath) => {
            const filename = imagePath.split('/').pop() || imagePath;
            return dispatch(deleteImageThunk(filename)).unwrap();
          })
        );
      } catch (deleteError) {
        console.warn('Failed to delete some files:', deleteError);
        // Continue with form submission even if deletion fails
      }
    }

    // Transform form data to API format
    const cleanedFormData = toApiData(filteredFormData, site);

    const handleSuccess = () => {
      // Success callback - show success message and close modal after 3s
      setShowSuccessMessage(true);
      setTimeout(() => {
        if (onModalClose) {
          onModalClose(); // Use modal's own close function
        } else {
          navigate(navigateToHome()); // Fallback for non-modal usage
        }
      }, TIMEOUTS.PASSWORD_VALIDATION_DELAY);
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
      (window as unknown as { __retrySuccessCallback?: () => void }).__retrySuccessCallback =
        handleSuccess;

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
    galleryImages,

    // Gallery state
    isUploadingImages,
    galleryError,
    imagesToDelete,

    // Helper functions
    handleWindDirectionChange,
    handleAccessOptionChange,
    addBilingualArrayItem,
    removeBilingualArrayItem,
    addLandingField,
    removeLandingField,
    addTracklog,
    removeTracklog,
    handleImageUpload,
    handleImageDelete,
    handleImageUpdate,
  };
};
