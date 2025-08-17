import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { loadSitesThunk } from '@store/thunks/sitesThunks';
import type { AppDispatch } from '@store/store';
import { useSites } from '@hooks/business/useSites';
import { useAuth } from "@hooks/auth/useAuth";

export function useHomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const [showWindFilter, setShowWindFilter] = useState(false);
  const { isAuthenticated } = useAuth();

  const { homeView, setHomeView, filter } = useSites();

  // Load sites on app start
  useEffect(() => {
    dispatch(loadSitesThunk());
  }, [dispatch]);


  const handleViewToggle = (view: 'map' | 'list') => {
    setHomeView(view);
  };

  const handleWindFilterToggle = () => {
    setShowWindFilter(!showWindFilter);
  };

  const handleWindFilterClose = () => {
    setShowWindFilter(false);
  };

  return {
    homeView,
    filter,
    showWindFilter,
    isAuthenticated,
    onViewToggle: handleViewToggle,
    onWindFilterToggle: handleWindFilterToggle,
    onWindFilterClose: handleWindFilterClose,
  };
}
