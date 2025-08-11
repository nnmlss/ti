// import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';

import GpsOffIcon from '@mui/icons-material/GpsOff';
import { useDeleteSiteMutation } from '../store/apiSlice';

interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  siteId: string;
  title: string;
  onConfirm?: () => void;
}

export function DeleteConfirmDialog({
  open,
  onClose,
  siteId,
  title,
  onConfirm,
}: DeleteConfirmDialogProps) {
  const [deleteSite, { isLoading: isDeleting }] = useDeleteSiteMutation();

  const handleConfirm = async () => {
    if (onConfirm) {
      onConfirm();
    } else {
      try {
        await deleteSite(siteId).unwrap();
        onClose();
      } catch (error) {
        console.error('Failed to delete site:', error);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', color: 'error.main' }}>
        Изтриване на място за летене
      </DialogTitle>
      <DialogContent>
        <Box sx={{ my: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
          <GpsOffIcon color='error' />
          <Typography>Наистина искаш да изтриеш "{title}"?</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isDeleting}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          color='error'
          variant='contained'
          disabled={isDeleting}
          startIcon={
            isDeleting ? <CircularProgress size={21} sx={{ color: 'white' }} /> : undefined
          }
          sx={
            isDeleting
              ? {
                  color: 'white !important',
                  '& .MuiCircularProgress-root': {
                    color: 'white !important',
                  },
                }
              : undefined
          }
        >
          {isDeleting ? '' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
