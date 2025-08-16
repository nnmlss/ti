import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import type { RootState, AppDispatch } from '@store/store';
import { loadSingleSiteThunk } from '@store/thunks/sitesThunks';
import { clearCurrentSite } from '@store/slices/singleSiteSlice';
import { useModal } from '@hooks/ui/useModal';
import { isNumericSlug, getCanonicalSiteUrl } from '@utils/slugUtils';

export function useSiteDetailPage() {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { handleClose } = useModal(true);

  // Get site from current site state (loaded individually)
  const site = useSelector((state: RootState) => state.singleSite.data);
  const loadState = useSelector((state: RootState) => state.singleSite.load);
  const loading = loadState.status;

  // Load individual site data and handle redirects
  useEffect(() => {
    const siteIdentifier = id || slug;
    
    if (siteIdentifier) {
      // Load site by identifier (ID or slug)
      dispatch(loadSingleSiteThunk(siteIdentifier));
    }

    // Cleanup: clear current site when component unmounts
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

  return {
    site,
    loading,
    siteId: id || slug || '',
    onClose: handleClose,
  };
}
