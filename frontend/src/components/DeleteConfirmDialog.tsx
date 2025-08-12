// import React from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { deleteSiteThunk } from '../store/sitesThunk';
import type { RootState, AppDispatch } from '../store/store';
import { AccessibleDialog } from './AccessibleDialog';

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
  const dispatch = useDispatch<AppDispatch>();
  const isDeleting = useSelector((state: RootState) => state.loading.deleting);

  const handleConfirm = async () => {
    if (onConfirm) {
      onConfirm();
    } else {
      try {
        await dispatch(deleteSiteThunk(siteId));
        onClose();
      } catch (error) {
        console.error('Failed to delete site:', error);
      }
    }
  };

  return (
    <AccessibleDialog
      open={open}
      onClose={onClose}
      maxWidth='sm'
      fullWidth
      title='Delete flying site confirmation'
      description={`Confirm deletion of site: ${title}`}
    >
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
        <Button onClick={handleConfirm} color='error' variant='contained' disabled={isDeleting}>
          {isDeleting ? (
            <CircularProgress size={21} sx={{ color: 'white' }} disableShrink />
          ) : (
            'Изтрии'
          )}
        </Button>
      </DialogActions>
    </AccessibleDialog>
  );
}
