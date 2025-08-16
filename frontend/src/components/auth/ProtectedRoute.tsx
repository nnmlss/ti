import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';
import { Container, Paper, Typography, CircularProgress, Box } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireSuperAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireSuperAdmin = false 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
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

  if (!isAuthenticated) {
    return <Navigate to="/adm1n" replace />;
  }

  if (requireSuperAdmin && !user?.isSuperAdmin) {
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

  return <>{children}</>;
};