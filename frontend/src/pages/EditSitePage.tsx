import { useParams, useNavigate } from 'react-router-dom';
import { useGetSiteQuery } from '../store/apiSlice';
import EditSite from '../components/EditSite';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  IconButton, 
  CircularProgress, 
  Alert, 
  Box 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export function EditSitePage() {
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

    return site ? <EditSite site={site} /> : <Alert severity='warning'>Site not found.</Alert>;
  };

  return (
    <Dialog 
      open={true} 
      onClose={handleClose} 
      maxWidth='md' 
      fullWidth
      scroll='paper'
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1
      }}>
        Промени място за летене
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
