import { useSelector, useDispatch } from 'react-redux';
import { Dialog, DialogContent, DialogActions, Button, Alert, AlertTitle, CircularProgress } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '../store/store';
import { hideErrorNotification, setRetrying } from '../store/slices/errorNotificationSlice';
import { loadSitesThunk, loadSingleSiteThunk, addSiteThunk, updateSiteThunk, deleteSiteThunk } from '../store/thunks/sitesThunks';

export function GlobalErrorNotification() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { open, message, title, retryAction, isRetrying } = useSelector((state: RootState) => state.errorNotification);

  // Show retry button if we have a retry action available
  const showRetryButton = !!retryAction;

  // Show home button for 404 errors
  const showHomeButton = title?.includes('не е намерена') || message.includes('не съществува');

  const handleClose = () => {
    dispatch(hideErrorNotification());
  };

  const handleRetry = async () => {
    if (retryAction) {
      // Set retry loading state
      dispatch(setRetrying(true));
      
      // Map retry action types to actual thunk functions
      const { type, payload, onSuccess } = retryAction;
      
      try {
        switch (type) {
          case 'sites/loadSites':
            await dispatch(loadSitesThunk()).unwrap();
            break;
          case 'sites/loadSingleSite':
            if (payload) {
              await dispatch(loadSingleSiteThunk(payload)).unwrap();
            }
            break;
          case 'sites/addSite':
            if (payload) {
              await dispatch(addSiteThunk(payload)).unwrap();
            }
            break;
          case 'sites/updateSite':
            if (payload) {
              await dispatch(updateSiteThunk(payload)).unwrap();
            }
            break;
          case 'sites/deleteSite':
            if (payload) {
              await dispatch(deleteSiteThunk(payload)).unwrap();
            }
            break;
          default:
            console.warn('Unknown retry action type:', type);
            dispatch(setRetrying(false));
            return;
        }
        // Execute success callback if provided
        if (onSuccess) {
          onSuccess();
        } else if ((window as unknown as { __retrySuccessCallback?: () => void }).__retrySuccessCallback) {
          (window as unknown as { __retrySuccessCallback?: () => void }).__retrySuccessCallback!();
          (window as unknown as { __retrySuccessCallback?: () => void }).__retrySuccessCallback = undefined; // Clean up
        }
        // Close modal on successful retry
        dispatch(hideErrorNotification());
      } catch {
        // Reset retry state on failure
        dispatch(setRetrying(false));
        // If retry fails, the error middleware will show a new error notification
        // Don't close the current modal so user can see the original error is still there
      }
    }
  };

  const handleGoHome = () => {
    navigate('/');
    handleClose();
  };

  // No auto-close for any errors - user must manually close

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
            disabled={isRetrying}
            startIcon={isRetrying ? <CircularProgress size={16} /> : <RefreshIcon />}
          >
            {isRetrying ? 'Retrying...' : 'Retry'}
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
