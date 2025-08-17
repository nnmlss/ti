import { useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogActions, Button, Alert, AlertTitle } from '@mui/material';
import type { NotificationState } from '@app-types';

interface NotificationDialogProps {
  notification: NotificationState;
  onClose: () => void;
}

export function NotificationDialog({ notification, onClose }: NotificationDialogProps) {
  const { open, message, severity, title, onAutoClose } = notification;

  const handleClose = useCallback(() => {
    if (onAutoClose) {
      onAutoClose();
    }
    onClose();
  }, [onAutoClose, onClose]);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        handleClose();
      }, 7000);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [open, handleClose]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='notification-dialog-title'
      aria-describedby='notification-dialog-description'
      maxWidth='sm'
      fullWidth
    >
      <DialogContent>
        <Alert severity={severity}>
          {title && <AlertTitle>{title}</AlertTitle>}
          {message}
        </Alert>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='primary' variant='contained'>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
