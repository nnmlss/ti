import React from 'react';
import { BottomNavigationBar } from '@components/navigation/BottomNavigationBar';

interface MainLayoutContainerProps {
  children: React.ReactNode;
}

export const MainLayoutContainer: React.FC<MainLayoutContainerProps> = ({ children }) => {
  return (
    <>
      {children}
      <BottomNavigationBar />
    </>
  );
};