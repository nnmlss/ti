import { useParams } from 'react-router-dom';
import { useGetSiteQuery } from '../store/apiSlice';
import { useModal } from '../hooks/useModal';
import { useQueryState } from '../hooks/useQueryState';
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
  const { handleClose } = useModal(true);

  // The 'skip' option prevents the query from running if the id is not available
  const siteQuery = useGetSiteQuery(id!, { skip: !id });
  const siteState = useQueryState(siteQuery);

  const renderContent = () => {
    if (siteState.isLoading) {
      return (
        <Box display='flex' justifyContent='center' p={4}>
          <CircularProgress disableShrink />
        </Box>
      );
    }

    if (siteState.isError) {
      return <Alert severity='error'>{siteState.error || 'Error loading site data!'}</Alert>;
    }

    return siteState.data ? (
      <SiteDetailView site={siteState.data} />
    ) : (
      <Alert severity='warning'>Site not found.</Alert>
    );
  };

  return (
    <AccessibleDialog
      open={true}
      onClose={handleClose}
      fullWidth
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
