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

export function GlobalErrorNotificationContainer() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { open, message, title, retryAction, isRetrying } = useSelector(
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
          (
            window as unknown as { __retrySuccessCallback?: () => void }
          ).__retrySuccessCallback = undefined;
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

  return (
    <GlobalErrorNotification
      open={open}
      title={title}
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