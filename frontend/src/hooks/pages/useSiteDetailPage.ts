import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import type { RootState, AppDispatch } from '@store/store';
import { loadSingleSiteThunk } from '@store/thunks/sitesThunks';
import { clearCurrentSite } from '@store/slices/singleSiteSlice';
import { selectAllSites } from '@store/slices/allSitesSlice';
import { isNumericSlug, getCanonicalSiteUrl } from '@utils/slugUtils';

export function useSiteDetailPage() {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle success notification from navigation state
  const [notification, setNotification] = useState<{ title: string; message: string } | null>(null);

  useEffect(() => {
    const locationState = location.state as { notification?: { title: string; message: string } } | null;
    if (locationState?.notification) {
      setNotification(locationState.notification);
      // Clear the notification from location state
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location, navigate]);

  const onClose = () => {
    navigate('/');
  };

  // Get site from current site state (loaded individually)
  const site = useSelector((state: RootState) => state.singleSite.data);
  const loadState = useSelector((state: RootState) => state.singleSite.load);
  const loading = loadState.status;

  // Get all sites for SitesLinksList component (loaded by app initialization)
  const allSites = useSelector(selectAllSites);

  // Load individual site data
  useEffect(() => {
    const siteIdentifier = id || slug;

    if (siteIdentifier) {
      dispatch(loadSingleSiteThunk(siteIdentifier));
    }

    return () => {
      dispatch(clearCurrentSite());
    };
  }, [dispatch, id, slug]);

  // Handle redirect from numeric URLs to canonical slug URLs
  useEffect(() => {
    // Only redirect after site is successfully loaded and we're not already loading
    if (site && loading === 'success') {
      if (slug && isNumericSlug(slug)) {
        // If we accessed via numeric slug (/sites/123), redirect to canonical URL
        const canonicalUrl = getCanonicalSiteUrl(site);
        navigate(canonicalUrl, { replace: true });
      } else if (id) {
        // If we accessed via old route (/site/123), redirect to canonical URL
        const canonicalUrl = getCanonicalSiteUrl(site);
        navigate(canonicalUrl, { replace: true });
      }
    }
  }, [site, loading, id, slug, navigate]);

  const dismissNotification = () => {
    setNotification(null);
  };

  return {
    site,
    loading,
    siteId: id || slug || '',
    allSites,
    notification,
    dismissNotification,
    onClose,
  };
}
