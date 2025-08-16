import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  AlertTitle,
  CircularProgress,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import HomeIcon from '@mui/icons-material/Home';
import type { GlobalErrorNotificationProps } from '@types';

export function GlobalErrorNotification({
  open,
  title,
  message,
  isRetrying,
  showRetryButton,
  showHomeButton,
  onClose,
  onRetry,
  onGoHome,
}: GlobalErrorNotificationProps) {

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
            onClick={onRetry}
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
            onClick={onGoHome}
            color='primary'
            variant='outlined'
            startIcon={<HomeIcon />}
          >
            Към началната страница
          </Button>
        )}
        <Button onClick={onClose} color='primary' variant='contained'>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
