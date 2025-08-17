import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { BottomNavigationBar } from '@/components/main/BottomNavigationBar';
import { WindDirectionFilter } from '@components/main/WindDirectionFilter';
import { setHomeView } from '@store/slices/homeViewSlice';
import { useAuth } from '@hooks/auth/useAuth';
import type { RootState } from '@store/store';

export const BottomNavigationBarContainer: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const homeView = useSelector((state: RootState) => state.homeView);
  const filter = useSelector((state: RootState) => state.filter);
  const [showWindFilter, setShowWindFilter] = useState(false);

  // Derived state
  const isHomePage = location.pathname === '/';
  const isListView = homeView === 'list';

  // Event handlers
  const handleViewToggle = (view: 'map' | 'list') => {
    if (isHomePage) {
      dispatch(setHomeView(view));
    } else {
      dispatch(setHomeView(view));
      navigate('/');
    }
  };

  return (
    <>
      {/* Wind Direction Filter */}
      {showWindFilter && <WindDirectionFilter onClose={() => setShowWindFilter(false)} />}

      <BottomNavigationBar
        isAuthenticated={isAuthenticated}
        isHomePage={isHomePage}
        isListView={isListView}
        filter={filter}
        onViewToggle={handleViewToggle}
        onWindFilterOpen={() => setShowWindFilter(true)}
      />
    </>
  );
};
