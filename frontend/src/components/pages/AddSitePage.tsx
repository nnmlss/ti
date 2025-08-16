import { DialogTitle, DialogContent, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import { useAddSitePage } from '@hooks/pages/useAddSitePage';
import { AccessibleDialog } from '@components/ui/AccessibleDialog';
import EditSite from '@components/site/EditSite';

export function AddSitePage() {
  const { onClose } = useAddSitePage();

  return (
    <AccessibleDialog
      open={true}
      onClose={onClose}
      maxWidth='md'
      fullWidth
      scroll='paper'
      title='Добавяне на място за летене'
      description='Форма за добавяне на ново място за летене'
      aria-label='Добавяне на място за летене'
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
          Добавяне на място за летене
        </Box>
        <IconButton onClick={onClose} size='small' aria-label='Затвори диалога'>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0, mb: 3 }}>
        <EditSite onClose={onClose} />
      </DialogContent>
    </AccessibleDialog>
  );
}
