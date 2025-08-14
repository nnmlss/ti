import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import type { RootState, AppDispatch } from '../store/store';
import { loadSingleSiteThunk } from '../store/thunks/sitesThunks';
import { clearCurrentSite } from '../store/slices/singleSiteSlice';
import { useModal } from '../hooks/useModal';
import EditSite from '../components/site/EditSite';
import { AccessibleDialog } from '../components/ui/AccessibleDialog';
import {
  DialogTitle,
  DialogContent,
  IconButton,
  CircularProgress,
  Alert,
  Box,
  // Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
// import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';

export function EditSitePage() {
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
          <CircularProgress variant='indeterminate' color='primary' disableShrink />
        </Box>
      );
    }

    return site ? (
      <EditSite site={site} onClose={handleClose} />
    ) : (
      <Alert severity='error'>
        Ифромацията за място с ID:{id} не е намерена. Или не съществува, или има проблем с
        интернет връзката към сървъра.
      </Alert>
    );
  };

  return (
    <AccessibleDialog
      open={true}
      onClose={handleClose}
      maxWidth={site ? 'md' : 'sm'}
      fullWidth
      scroll='paper'
      title='Редакция на място за летене'
      description='Форма за редактиране на информацията за място за летене'
      aria-label='Редакция на място за летене'
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <GpsFixedIcon sx={{ mr: 1 }} />
          Редакция на място за летене
        </Box>
        <IconButton onClick={handleClose} size='small' aria-label='Затвори диалога'>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>{renderContent()}</DialogContent>
    </AccessibleDialog>
  );
}
