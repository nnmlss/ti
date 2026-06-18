import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import type { RootState, AppDispatch } from '@store/store';
import { loadSingleSiteThunk } from '@store/thunks/sitesThunks';
import { clearCurrentSite } from '@store/slices/singleSiteSlice';
import { selectAllSites } from '@store/slices/allSitesSlice';
import {
  isNumericSlug,
  getCanonicalSiteUrl,
  getEnSlug,
  generateSiteSlug,
  extractSiteNameFromSlug,
} from '@utils/slugUtils';
import { getLocalized } from '@utils/localizedText';

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

  // Resolve the real site name for the loading-state SEO title. The list is
  // already in the store when arriving from the map/list, so we use the actual
  // title (correct dashes/casing/language) instead of reconstructing it from the
  // lossy slug. Slug reconstruction stays only as a cold-deep-link fallback.
  const routeIdentifier = id || slug || '';
  const isEnRoute = location.pathname.startsWith('/en/');
  const fallbackSite = allSites.find((s) =>
    isNumericSlug(routeIdentifier)
      ? String(s._id) === routeIdentifier
      : isEnRoute
        ? getEnSlug(s) === routeIdentifier
        : (s.url || generateSiteSlug(s.title)) === routeIdentifier
  );
  const fallbackName = fallbackSite
    ? getLocalized(fallbackSite.title, isEnRoute ? 'en' : 'bg')
    : slug
      ? extractSiteNameFromSlug(slug)
      : 'Място за летене';

  // Load individual site data. The backend resolver handles BG `url`, numeric id
  // and the /en English slug, so we just pass the route identifier through.
  useEffect(() => {
    const siteIdentifier = id || slug;

    if (siteIdentifier) {
      dispatch(loadSingleSiteThunk(siteIdentifier));
    }

    return () => {
      dispatch(clearCurrentSite());
    };
  }, [dispatch, id, slug]);

  // Redirect non-canonical URLs to the Bulgarian canonical (/парапланер-старт/:slug).
  // The Latin keyword route and legacy numeric route exist for SEO/back-compat only;
  // the site always "opens on" the Bulgarian URL. Guarded so the canonical route
  // never redirects to itself (no loop).
  useEffect(() => {
    // Only redirect after site is successfully loaded and we're not already loading
    if (site && loading === 'success') {
      const isParaglidingSiteRoute = location.pathname.startsWith('/paragliding-site/');
      if ((slug && isNumericSlug(slug)) || id || isParaglidingSiteRoute) {
        const canonicalUrl = getCanonicalSiteUrl(site);
        navigate(canonicalUrl, { replace: true });
      }
    }
  }, [site, loading, id, slug, location.pathname, navigate]);

  const dismissNotification = () => {
    setNotification(null);
  };

  return {
    site,
    loading,
    siteId: id || slug || '',
    fallbackName,
    allSites,
    notification,
    dismissNotification,
    onClose,
  };
}
