import React from 'react';
import { Container, Paper, Typography, CircularProgress, Box } from '@mui/material';
import type { ProtectedRouteProps } from '@app-types';

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ state }) => {
  if (state === 'loading') {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        </Paper>
      </Container>
    );
  }

  if (state === 'access-denied') {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom align="center" color="error">
            Access Denied
          </Typography>
          <Typography variant="body1" align="center" color="textSecondary">
            You don't have permission to access this page.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return null;
};