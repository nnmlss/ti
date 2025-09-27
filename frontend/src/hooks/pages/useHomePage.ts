import { useState } from 'react';
import { useSites } from '@hooks/business/useSites';
import { useAuth } from "@hooks/auth/useAuth";

export function useHomePage() {
  const [showWindFilter, setShowWindFilter] = useState(false);
  const { isAuthenticated } = useAuth();
  const { homeView, setHomeView, filter } = useSites();


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
