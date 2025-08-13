import { useSelector, useDispatch } from 'react-redux';
import { Dialog, DialogContent, DialogActions, Button, Alert, AlertTitle } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '../store/store';
import { hideErrorNotification } from '../store/slices/errorNotificationSlice';
import { loadSitesThunk } from '../store/thunks/sitesThunks';
import { useEffect } from 'react';

export function GlobalErrorNotification() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { open, message, title } = useSelector((state: RootState) => state.errorNotification);

  // Show retry button for certain error types
  const showRetryButton = title?.includes('Load Sites') || message.includes('Network error');
  
  // Show home button for 404 errors
  const showHomeButton = title?.includes('не е намерена') || message.includes('не съществува');

  const handleClose = () => {
    dispatch(hideErrorNotification());
  };

  const handleRetry = () => {
    // Retry common operations based on error type
    if (title?.includes('Load Sites')) {
      dispatch(loadSitesThunk());
    }
    handleClose();
  };

  const handleGoHome = () => {
    navigate('/');
    handleClose();
  };

  // Auto-close after 10 seconds (but NOT for 404 errors)
  useEffect(() => {
    if (open && !showHomeButton) {
      const timer = setTimeout(() => {
        handleClose();
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [open, showHomeButton]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='error-notification-title'
      maxWidth='sm'
      fullWidth
    >
      <DialogContent>
        <Alert severity='error'>
          {title && <AlertTitle>{title}</AlertTitle>}
          {message}
        </Alert>
      </DialogContent>
      <DialogActions>
        {showRetryButton && (
          <Button 
            onClick={handleRetry} 
            color='primary' 
            variant='outlined'
            startIcon={<RefreshIcon />}
          >
            Retry
          </Button>
        )}
        {showHomeButton && (
          <Button 
            onClick={handleGoHome} 
            color='primary' 
            variant='outlined'
            startIcon={<HomeIcon />}
          >
            Към началната страница
          </Button>
        )}
        <Button onClick={handleClose} color='primary' variant='contained'>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}