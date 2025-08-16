import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@store/store';
import {
  addSiteLocally,
  updateSiteLocally,
  deleteSiteLocally,
  resetLoadState as resetAllSitesLoadState,
} from '@store/slices/allSitesSlice';
import {
  setCurrentSite,
  clearCurrentSite,
  resetLoadState as resetSiteLoadState,
  resetEditState,
  resetDeleteState,
} from '@store/slices/singleSiteSlice';
import { setHomeView } from '@store/slices/homeViewSlice';
import { setWindDirectionFilter, clearFilters } from '@store/slices/filterSlice';
import type { FlyingSite, WindDirection } from '@types';

export const useSites = () => {
  const dispatch = useDispatch<AppDispatch>();
  const allSitesData = useSelector((state: RootState) => state.allSites.data);
  const allSitesLoadState = useSelector((state: RootState) => state.allSites.load);
  const singleSiteData = useSelector((state: RootState) => state.singleSite.data);
  const singleSiteLoadState = useSelector((state: RootState) => state.singleSite.load);
  const singleSiteEditState = useSelector((state: RootState) => state.singleSite.edit);
  const singleSiteDeleteState = useSelector((state: RootState) => state.singleSite.delete);
  const homeView = useSelector((state: RootState) => state.homeView);
  const filter = useSelector((state: RootState) => state.filter);

  // Filter sites based on wind direction if filter is active
  const sites = filter.windDirection
    ? allSitesData.filter(
        (site) =>
          site.windDirection &&
          site.windDirection.includes(filter.windDirection as WindDirection)
      )
    : allSitesData;

  return {
    // State - All Sites
    sites,
    allSitesLoadState,

    // State - Single Site
    currentSite: singleSiteData,
    siteLoadState: singleSiteLoadState,
    siteEditState: singleSiteEditState,
    siteDeleteState: singleSiteDeleteState,

    // UI State
    homeView,
    filter,

    // Actions - Local site management
    addSiteLocally: (site: FlyingSite) => dispatch(addSiteLocally(site)),
    updateSiteLocally: (site: FlyingSite) => dispatch(updateSiteLocally(site)),
    deleteSiteLocally: (id: number) => dispatch(deleteSiteLocally(id)),

    // Actions - Single site management
    setCurrentSite: (site: FlyingSite | null) => dispatch(setCurrentSite(site)),
    clearCurrentSite: () => dispatch(clearCurrentSite()),

    // Actions - State reset
    resetAllSitesLoadState: () => dispatch(resetAllSitesLoadState()),
    resetSiteLoadState: () => dispatch(resetSiteLoadState()),
    resetEditState: () => dispatch(resetEditState()),
    resetDeleteState: () => dispatch(resetDeleteState()),

    // Actions - UI
    setHomeView: (view: 'map' | 'list') => dispatch(setHomeView(view)),
    setWindDirectionFilter: (direction: string | null) =>
      dispatch(setWindDirectionFilter(direction)),
    clearFilters: () => dispatch(clearFilters()),
  };
};
