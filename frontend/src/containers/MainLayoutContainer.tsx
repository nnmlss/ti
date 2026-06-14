import React from 'react';
import { BottomNavigationBarContainer } from './BottomNavigationBarContainer';
import { useLanguageRouteSync } from '@hooks/ui/useLanguageRouteSync';
import type { MainLayoutContainerProps } from '@app-types';

export const MainLayoutContainer: React.FC<MainLayoutContainerProps> = ({ children }) => {
  // Keeps the active language in step with the URL (must be inside <Router>).
  useLanguageRouteSync();

  return (
    <>
      {children}
      <BottomNavigationBarContainer />
    </>
  );
};