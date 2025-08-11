import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import {
  setSites,
  addSite,
  updateSite,
  deleteSite,
  setLoading,
  setError,
  clearError,
  setHomeView,
} from '../store/sitesSlice';
import type { FlyingSite } from '../types';

export const useSites = () => {
  const dispatch = useDispatch<AppDispatch>();
  const sites = useSelector((state: RootState) => state.sites);
  const loading = useSelector((state: RootState) => state.loading);
  const error = useSelector((state: RootState) => state.error);
  const homeView = useSelector((state: RootState) => state.homeView);

  return {
    // State
    sites,
    loading,
    error,
    homeView,

    // Actions
    setSites: (sites: FlyingSite[]) => dispatch(setSites(sites)),
    addSite: (site: FlyingSite) => dispatch(addSite(site)),
    updateSite: (site: FlyingSite) => dispatch(updateSite(site)),
    deleteSite: (id: string) => dispatch(deleteSite(id)),
    setLoading: (loading: boolean) => dispatch(setLoading(loading)),
    setError: (error: string | null) => dispatch(setError(error)),
    clearError: () => dispatch(clearError()),
    setHomeView: (view: 'map' | 'list') => dispatch(setHomeView(view)),
  };
};
