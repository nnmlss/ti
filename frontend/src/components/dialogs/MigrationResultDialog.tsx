import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import type { MigrationResultDialogProps } from '@app-types';

export const MigrationResultDialog: React.FC<MigrationResultDialogProps> = ({
  open,
  onClose,
  isLoading,
  result,
  error,
}) => {
  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth='sm'
      fullWidth
      disableEscapeKeyDown={isLoading}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isLoading && <CircularProgress size={24} />}
          {result?.success && !isLoading && <CheckCircleIcon color='success' />}
          {(error || (result && !result.success)) && !isLoading && <ErrorIcon color='error' />}

          {isLoading
            ? 'Migrating URLs...'
            : error
            ? 'Migration Failed'
            : result?.success
            ? 'Migration Completed'
            : 'Migration Error'}
        </Box>
      </DialogTitle>

      <DialogContent>
        {isLoading && (
          <Typography>Please wait while the URL migration is in progress...</Typography>
        )}

        {error && !isLoading && (
          <Alert severity='error' sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {result && !isLoading && (
          <>
            <Alert severity={result.success ? 'success' : 'error'} sx={{ mb: 2 }}>
              {result.message}
            </Alert>

            {result.success && (
              <Box sx={{ mt: 2 }}>
                <Typography variant='body2' color='text.secondary'>
                  <strong>Sites updated:</strong> {result.sitesUpdated}
                </Typography>

                {result.errors.length > 0 && (
                  <Typography variant='body2' color='warning.main' sx={{ mt: 1 }}>
                    <strong>Warnings:</strong> {result.errors.length} issue(s) encountered
                  </Typography>
                )}
              </Box>
            )}

            {result.errors.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant='subtitle2' color='text.secondary' gutterBottom>
                  Details:
                </Typography>
                <Box
                  sx={{
                    maxHeight: 200,
                    overflow: 'auto',
                    bgcolor: 'grey.50',
                    p: 1,
                    borderRadius: 1,
                    fontSize: '0.875rem',
                    fontFamily: 'monospace',
                  }}
                >
                  {result.errors.map((err, index) => (
                    <Typography
                      key={index}
                      variant='body2'
                      component='div'
                      sx={{ color: 'text.secondary' }}
                    >
                      {err}
                    </Typography>
                  ))}
                </Box>
              </Box>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading} variant='contained'>
          {isLoading ? 'Please wait...' : 'Close'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
