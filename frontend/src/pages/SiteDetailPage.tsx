import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import type { RootState, AppDispatch } from '../store/store';
import { loadSingleSiteThunk } from '../store/thunks/sitesThunks';
import { clearCurrentSite } from '../store/slices/singleSiteSlice';
import { useModal } from '../hooks/useModal';
import { SiteDetailView } from '../components/SiteDetailView';
import { AccessibleDialog } from '../components/AccessibleDialog';
import {
  DialogTitle,
  DialogContent,
  IconButton,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export function SiteDetailPage() {
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

  const renderContent = () => {
    // Show loading while fetching individual site data
    if (loading === 'pending') {
      return (
        <Box display='flex' justifyContent='center' p={4}>
          <CircularProgress disableShrink />
        </Box>
      );
    }

    return site ? (
      <SiteDetailView site={site} />
    ) : (
      <Alert severity='warning'>Site not found. ID: {id}</Alert>
    );
  };

  return (
    <AccessibleDialog
      open={true}
      onClose={handleClose}
      fullWidth
      maxWidth={false}
      scroll='paper'
      title='Детайли за място за летене'
      description='Подробна информация за избраното място за летене'
      aria-label='Детайли за място за летене'
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          pb: 1,
        }}
      >
        <IconButton onClick={handleClose} size='small' aria-label='Затвори диалога'>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0, boxShadow: 'none', border: 'none' }}>
        {renderContent()}
      </DialogContent>
    </AccessibleDialog>
  );
}
