import React from 'react';
import { BottomNavigationBarContainer } from './BottomNavigationBarContainer';
import type { MainLayoutContainerProps } from '@app-types';

export const MainLayoutContainer: React.FC<MainLayoutContainerProps> = ({ children }) => {
  return (
    <>
      {children}
      <BottomNavigationBarContainer />
    </>
  );
};