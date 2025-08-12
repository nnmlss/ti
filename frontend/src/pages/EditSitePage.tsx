import { useParams } from 'react-router-dom';
import { useGetSiteQuery } from '../store/apiSlice';
import { useModal } from '../hooks/useModal';
import { useQueryState } from '../hooks/useQueryState';
import EditSite from '../components/EditSite';
import { AccessibleDialog } from '../components/AccessibleDialog';
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
  const { handleClose } = useModal(true);

  // The 'skip' option prevents the query from running if the id is not available
  const siteQuery = useGetSiteQuery(id!, { skip: !id });
  const siteState = useQueryState(siteQuery);

  const renderContent = () => {
    if (siteState.isLoading) {
      return (
        <Box display='flex' justifyContent='center' p={4}>
          <CircularProgress variant='indeterminate' color='primary' disableShrink />
        </Box>
      );
    }

    if (siteState.isError) {
      return <Alert severity='error'>{siteState.error || 'Error loading site data!'}</Alert>;
    }

    return siteState.data ? (
      <EditSite site={siteState.data} />
    ) : (
      <Alert severity='warning'>Site not found.</Alert>
    );
  };

  return (
    <AccessibleDialog
      open={true}
      onClose={handleClose}
      maxWidth='md'
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
          pb: 1,
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
