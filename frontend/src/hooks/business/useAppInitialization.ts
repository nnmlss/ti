import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@store/store';
import { loadSitesThunk } from '@store/thunks/sitesThunks';

/**
 * Custom hook for app-level initialization and data fetching
 * Called once when the app loads/reloads to fetch initial data
 */
export const useAppInitialization = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Fetch all sites on app initialization
    dispatch(loadSitesThunk());

    // Add other app-level GraphQL requests here as needed
    // Examples:
    // dispatch(loadUserSettingsThunk());
    // dispatch(loadConstantsThunk());

    console.log('~~~ App Initialization');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
