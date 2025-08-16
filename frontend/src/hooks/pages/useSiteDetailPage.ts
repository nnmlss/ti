import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import type { RootState, AppDispatch } from '@store/store';
import { loadSingleSiteThunk } from '@store/thunks/sitesThunks';
import { clearCurrentSite } from '@store/slices/singleSiteSlice';
import { useModal } from '@hooks/ui/useModal';

export function useSiteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { handleClose } = useModal(true);

  // Get site from current site state (loaded individually)
  const site = useSelector((state: RootState) => state.singleSite.data);
  const loadState = useSelector((state: RootState) => state.singleSite.load);
  const loading = loadState.status;

  // Load individual site data on mount
  useEffect(() => {
    if (id) {
      const numId = Number(id);
      if (!Number.isNaN(numId)) {
        dispatch(loadSingleSiteThunk(numId));
      }
    }

    // Cleanup: clear current site when component unmounts
    return () => {
      dispatch(clearCurrentSite());
    };
  }, [dispatch, id]);

  return {
    site,
    loading,
    siteId: id || '',
    onClose: handleClose,
  };
}
