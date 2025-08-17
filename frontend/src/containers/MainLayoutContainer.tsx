import React from 'react';
import { BottomNavigationBarContainer } from './BottomNavigationBarContainer';

interface MainLayoutContainerProps {
  children: React.ReactNode;
}

export const MainLayoutContainer: React.FC<MainLayoutContainerProps> = ({ children }) => {
  return (
    <>
      {children}
      <BottomNavigationBarContainer />
    </>
  );
};