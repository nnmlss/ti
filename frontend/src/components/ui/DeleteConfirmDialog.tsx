import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';

import GpsOffIcon from '@mui/icons-material/GpsOff';
import { AccessibleDialog } from './AccessibleDialog';
import type { DeleteConfirmDialogProps } from '@types';

export function DeleteConfirmDialog({
  open,
  onClose,
  title,
  isLoading,
  onConfirm,
}: DeleteConfirmDialogProps) {

  return (
    <AccessibleDialog
      open={open}
      onClose={onClose}
      maxWidth='sm'
      fullWidth
      title='Delete flying site confirmation'
      description={`Confirm deletion of site: ${title}`}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: 'error.main',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        Изтриване на място за летене
      </DialogTitle>
      <DialogContent>
        <Box sx={{ my: 2, pt: 3, display: 'flex', justifyContent: 'center' }}>
          <GpsOffIcon color='error' sx={{ mr: 1 }} />
          <Typography>Наистина искаш да изтриеш "{title}"?</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant='outlined' disabled={isLoading}>
          Не
        </Button>
        <Button
          onClick={onConfirm}
          color='error'
          variant='contained'
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress size={21} sx={{ color: 'white' }} disableShrink />
          ) : (
            'Изтрии'
          )}
        </Button>
      </DialogActions>
    </AccessibleDialog>
  );
}
