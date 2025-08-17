import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@hooks/auth/useAuth';
import { ProtectedRoute } from '@components/auth/ProtectedRoute';
import type { ProtectedRouteContainerProps } from '@app-types';

export const ProtectedRouteContainer: React.FC<ProtectedRouteContainerProps> = ({
  children,
  requireSuperAdmin = false,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <ProtectedRoute state='loading' />;
  }

  if (!isAuthenticated) {
    return <Navigate to='/adm1n' replace />;
  }

  if (requireSuperAdmin && !user?.isSuperAdmin) {
    return <ProtectedRoute state='access-denied' />;
  }

  return <>{children}</>;
};
