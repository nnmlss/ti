import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import EditSite from '../components/EditSite';

export function AddSitePage() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/');
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
        Добави ново място за летене
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <EditSite />
      </DialogContent>
    </Dialog>
  );
}
