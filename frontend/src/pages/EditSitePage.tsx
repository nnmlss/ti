import { useParams } from 'react-router-dom';
import { useGetSiteQuery } from '../store/apiSlice';
import { useModal } from '../hooks/useModal';
import EditSite from '../components/EditSite';
import {
  Dialog,
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
  const { data: site, error, isLoading } = useGetSiteQuery(id!, { skip: !id });

  const renderContent = () => {
    if (isLoading) {
      return (
        <Box display='flex' justifyContent='center' p={4}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return <Alert severity='error'>Error loading site data!</Alert>;
    }

    return site ? <EditSite site={site} /> : <Alert severity='warning'>Site not found.</Alert>;
  };

  return (
    <Dialog open={true} onClose={handleClose} maxWidth='md' fullWidth scroll='paper'>
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
        <IconButton onClick={handleClose} size='small'>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>{renderContent()}</DialogContent>
    </Dialog>
  );
}
