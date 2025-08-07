import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';

import GpsOffIcon from '@mui/icons-material/GpsOff';

interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}

export function DeleteConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', color: 'error.main' }}>
        Изтриване на място за летене
      </DialogTitle>
      <DialogContent>
        <Box sx={{ my: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
          {/* <DeleteIcon sx={{ mr: 0 }} /> */}
          <GpsOffIcon color='error' />
          <Typography>Наистина искаш да изтриеш "{title}"?</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} color='error' variant='contained'>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
