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
import { deleteSiteThunk } from '../store/thunks/sitesThunks';
import type { RootState, AppDispatch } from '../store/store';
import { dispatchThunkWithCallback } from '../store/utils/thunkWithCallback';
import { AccessibleDialog } from './AccessibleDialog';
import { useImmediateAsync } from '../hooks/useImmediateAsync';

interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  siteId: number;
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
  const reduxIsDeleting = useSelector(
    (state: RootState) => state.singleSite.delete.status === 'pending'
  );

  const deleteAction = useImmediateAsync({
    externalLoading: reduxIsDeleting,
    onError: (error) => {
      console.error('Failed to delete site:', error);
    },
  });

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      deleteAction.execute(async () => {
        await dispatchThunkWithCallback(dispatch, {
          thunkAction: deleteSiteThunk(siteId),
          onSuccess: () => {
            onClose();
          },
        });
      });
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
        <Button onClick={onClose} variant='outlined' disabled={deleteAction.isLoading}>
          Не
        </Button>
        <Button
          onClick={handleConfirm}
          color='error'
          variant='contained'
          disabled={deleteAction.isLoading}
        >
          {deleteAction.isLoading ? (
            <CircularProgress size={21} sx={{ color: 'white' }} disableShrink />
          ) : (
            'Изтрии'
          )}
        </Button>
      </DialogActions>
    </AccessibleDialog>
  );
}
