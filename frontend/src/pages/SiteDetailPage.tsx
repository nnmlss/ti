import { useParams, useNavigate } from 'react-router-dom';
import { useGetSiteQuery } from '../store/apiSlice';
import { SiteDetailView } from '../components/SiteDetailView';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  CircularProgress,
  Alert,
  Box,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

export function SiteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // The 'skip' option prevents the query from running if the id is not available
  const { data: site, error, isLoading } = useGetSiteQuery(id!, { skip: !id });

  const handleClose = () => {
    navigate('/');
  };

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

    return site ? (
      <SiteDetailView site={site} />
    ) : (
      <Alert severity='warning'>Site not found.</Alert>
    );
  };

  return (
    <Dialog open={true} onClose={handleClose} fullWidth scroll='paper'>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          pb: 1,
        }}
      >
        <IconButton onClick={handleClose} size='small'>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0, boxShadow: 'none', border: 'none' }}>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
