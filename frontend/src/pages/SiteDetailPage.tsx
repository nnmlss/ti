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
  Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import InfoIcon from '@mui/icons-material/Info';

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
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return <Alert severity='error'>Error loading site data!</Alert>;
    }

    return site ? <SiteDetailView site={site} /> : <Alert severity='warning'>Site not found.</Alert>;
  };

  return (
    <Dialog 
      open={true} 
      onClose={handleClose} 
      maxWidth='lg' 
      fullWidth
      scroll='paper'
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            variant='outlined'
            color='info'
            onClick={handleClose}
            sx={{ mr: 1 }}
            size='large'
          >
            <ArrowBackIosNewIcon />
          </Button>
          <InfoIcon sx={{ mr: 1 }} />
          {site ? `${site.title.bg}` : 'Site Details'}
        </Box>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 2 }}>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}