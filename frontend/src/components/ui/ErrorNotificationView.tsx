import { Dialog, DialogContent, Typography, Box, Button } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';
import RefreshIcon from '@mui/icons-material/Refresh';
import { GlobalErrorNotification } from '@components/ui/GlobalErrorNotification';

interface ErrorNotificationViewProps {
  isMaintenanceMode: boolean;
  errorNotification: {
    open: boolean;
    title: string | undefined;
    message: string;
    isRetrying: boolean;
    showRetryButton: boolean;
    showHomeButton: boolean;
  };
  onClose: () => void;
  onRetry: () => void;
  onGoHome: () => void;
}

export function ErrorNotificationView({
  isMaintenanceMode,
  errorNotification,
  onClose,
  onRetry,
  onGoHome,
}: ErrorNotificationViewProps) {
  if (isMaintenanceMode) {
    return (
      <Dialog
        open={isMaintenanceMode}
        maxWidth='sm'
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

            <Typography variant='h5' component='h2' fontWeight='bold'>
              WebApp under Maintenance
            </Typography>
            <Typography variant='body2' component='p' fontWeight='bold'>
              В момента няма връзка със сървъра
            </Typography>

            <Button
              variant='contained'
              startIcon={<RefreshIcon />}
              onClick={() => window.location.reload()}
              sx={{ mt: 2 }}
            >
              Опитай отново
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <GlobalErrorNotification
      open={errorNotification.open}
      title={errorNotification.title ?? null}
      message={errorNotification.message}
      isRetrying={errorNotification.isRetrying}
      showRetryButton={errorNotification.showRetryButton}
      showHomeButton={errorNotification.showHomeButton}
      onClose={onClose}
      onRetry={onRetry}
      onGoHome={onGoHome}
    />
  );
}
