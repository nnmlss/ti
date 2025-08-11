import { Dialog, DialogTitle, DialogContent, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import { useModal } from '../hooks/useModal';
import EditSite from '../components/EditSite';

export function AddSitePage() {
  const { handleClose } = useModal(true);

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
          Добавяне на място за летене
        </Box>
        <IconButton onClick={handleClose} size='small'>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0, mb: 3 }}>
        <EditSite />
      </DialogContent>
    </Dialog>
  );
}
