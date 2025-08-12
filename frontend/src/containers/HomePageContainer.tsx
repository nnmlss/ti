import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { loadSitesThunk } from '../store/thunks/sitesThunks';
import type { AppDispatch } from '../store/store';
import { useSites } from '../hooks/useSites';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { HomePage } from '../pages/HomePage';

export function HomePageContainer() {
  const dispatch = useDispatch<AppDispatch>();
  const [showWindFilter, setShowWindFilter] = useState(false);
  
  // Persist homeView preference
  const { value: storedHomeView, setValue: setStoredHomeView } = useLocalStorage<'map' | 'list'>(
    'homeView', 
    'map'
  );

  const { homeView, setHomeView, filter } = useSites();
  
  // Load sites on app start
  useEffect(() => {
    dispatch(loadSitesThunk());
  }, [dispatch]);

  // Sync localStorage with Redux state
  useEffect(() => {
    if (homeView !== storedHomeView) {
      setHomeView(storedHomeView);
    }
  }, [storedHomeView, homeView, setHomeView]);

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