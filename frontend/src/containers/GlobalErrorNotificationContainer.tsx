import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '@store/store';
import { hideErrorNotification, setRetrying } from '@store/slices/errorNotificationSlice';
import {
  loadSitesThunk,
  loadSingleSiteThunk,
  addSiteThunk,
  updateSiteThunk,
  deleteSiteThunk,
} from '@store/thunks/sitesThunks';
import { GlobalErrorNotification } from '@components/ui/GlobalErrorNotification';
import { Dialog, DialogContent, Typography, Box } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';

export function GlobalErrorNotificationContainer() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { open, message, title, retryAction, isRetrying, isMaintenanceMode } = useSelector(
    (state: RootState) => state.errorNotification
  );

  const showRetryButton = !!retryAction;
  const showHomeButton = title?.includes('не е намерена') || message.includes('не съществува');

  const handleClose = () => {
    dispatch(hideErrorNotification());
  };

  const handleRetry = async () => {
    if (retryAction) {
      dispatch(setRetrying(true));

      const { type, payload, onSuccess } = retryAction;

      try {
        switch (type) {
          case 'sites/loadSites':
            await dispatch(loadSitesThunk()).unwrap();
            break;
          case 'sites/loadSingleSite':
            if (payload) {
              await dispatch(loadSingleSiteThunk(payload as number)).unwrap();
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
              await dispatch(deleteSiteThunk(payload as number)).unwrap();
            }
            break;
          default:
            console.warn('Unknown retry action type:', type);
            dispatch(setRetrying(false));
            return;
        }
        
        if (onSuccess) {
          onSuccess();
        } else if (
          (window as unknown as { __retrySuccessCallback?: () => void }).__retrySuccessCallback
        ) {
          (window as unknown as { __retrySuccessCallback?: () => void })
            .__retrySuccessCallback!();
          delete (
            window as unknown as { __retrySuccessCallback?: () => void }
          ).__retrySuccessCallback;
        }
        
        dispatch(hideErrorNotification());
      } catch {
        dispatch(setRetrying(false));
      }
    }
  };

  const handleGoHome = () => {
    navigate('/');
    handleClose();
  };

  // Show maintenance dialog if in maintenance mode
  if (isMaintenanceMode) {
    return (
      <Dialog
        open={isMaintenanceMode}
        maxWidth="sm"
        fullWidth
        disableEscapeKeyDown
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 2,
            textAlign: 'center',
            p: 2,
          },
        }}
      >
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              py: 2,
            }}
          >
            <ConstructionIcon
              sx={{
                fontSize: 64,
                color: 'warning.main',
              }}
            />
            
            <Typography variant="h5" component="h2" fontWeight="bold">
              WebApp under construction
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <GlobalErrorNotification
      open={open}
      title={title ?? null}
      message={message}
      isRetrying={isRetrying}
      showRetryButton={showRetryButton}
      showHomeButton={showHomeButton}
      onClose={handleClose}
      onRetry={handleRetry}
      onGoHome={handleGoHome}
    />
  );
}