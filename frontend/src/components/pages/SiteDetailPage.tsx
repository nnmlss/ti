import { SiteDetailView } from '@components/site/SiteDetailView';
import { AccessibleDialog } from '@components/ui/AccessibleDialog';
import {
  DialogTitle,
  DialogContent,
  IconButton,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useSiteDetailPage } from '@hooks/pages/useSiteDetailPage';

export function SiteDetailPage() {
  const { site, loading, siteId, onClose } = useSiteDetailPage();
  const renderContent = () => {
    // Show loading while fetching individual site data
    if (loading === 'pending') {
      return (
        <Box display='flex' justifyContent='center' p={4}>
          <CircularProgress disableShrink />
        </Box>
      );
    }

    return site ? (
      <SiteDetailView site={site} />
    ) : (
      <Alert severity='warning'>
        Не е намерена информация за място с <strong>ID: {siteId}</strong>. Или не съществува, или
        има проблем с интернет връзката към сървъра.
      </Alert>
    );
  };

  return (
    <AccessibleDialog
      open={true}
      onClose={onClose}
      fullWidth
      maxWidth={site ? false : 'sm'}
      scroll='paper'
      title='Детайли за място за летене'
      description='Подробна информация за избраното място за летене'
      aria-label='Детайли за място за летене'
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          pb: 1,
        }}
      >
        <IconButton onClick={onClose} size='small' aria-label='Затвори диалога'>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0, boxShadow: 'none', border: 'none' }}>
        {renderContent()}
      </DialogContent>
    </AccessibleDialog>
  );
}