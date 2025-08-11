import { useEffect, useState } from 'react';
import { useGetSitesQuery } from '../store/apiSlice';
import { useSites } from '../hooks/useSites';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { HomePage } from '../pages/HomePage';

export function HomePageContainer() {
  const [showWindFilter, setShowWindFilter] = useState(false);
  
  // Persist homeView preference
  const { value: storedHomeView, setValue: setStoredHomeView } = useLocalStorage<'map' | 'list'>(
    'homeView', 
    'map'
  );

  // Centralized data fetching for both map and list views
  const {
    data: sites,
    error,
    isLoading,
  } = useGetSitesQuery(undefined, {
    pollingInterval: 30000, // Refetch every 30 seconds
    refetchOnFocus: true, // Refetch when user returns to tab
    refetchOnReconnect: true, // Refetch on network reconnection
  });
  
  const { setSites, setLoading, setError, homeView, setHomeView, filter } = useSites();
  
  // Sync localStorage with Redux state
  useEffect(() => {
    if (homeView !== storedHomeView) {
      setHomeView(storedHomeView);
    }
  }, [storedHomeView, homeView, setHomeView]);

  // Sync RTK Query data to sitesSlice once at the top level
  useEffect(() => {
    if (sites) {
      setSites(sites);
    }
    setLoading(isLoading);
    if (error) {
      setError('Error loading sites!');
    } else {
      setError(null);
    }
  }, [sites, isLoading, error, setSites, setLoading, setError]);

  const handleViewToggle = (view: 'map' | 'list') => {
    setHomeView(view);
    setStoredHomeView(view);
  };

  const handleWindFilterToggle = () => {
    setShowWindFilter(!showWindFilter);
  };

  const handleWindFilterClose = () => {
    setShowWindFilter(false);
  };

  return (
    <HomePage
      homeView={homeView}
      filter={filter}
      showWindFilter={showWindFilter}
      onViewToggle={handleViewToggle}
      onWindFilterToggle={handleWindFilterToggle}
      onWindFilterClose={handleWindFilterClose}
    />
  );
}