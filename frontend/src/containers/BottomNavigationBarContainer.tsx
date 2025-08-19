import React, { useState, useRef, useEffect } from 'react';
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
  const isMaintenanceMode = useSelector((state: RootState) => state.errorNotification.isMaintenanceMode);
  const [showWindFilter, setShowWindFilter] = useState(false);
  const windFilterRef = useRef<HTMLDivElement>(null);

  // Derived state
  const isHomePage = location.pathname === '/';
  const isListView = homeView === 'list';

  // Outside click handler for wind filter
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (windFilterRef.current && !windFilterRef.current.contains(event.target as Node)) {
        setShowWindFilter(false);
      }
    };

    if (showWindFilter) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showWindFilter]);

  // Event handlers
  const handleViewToggle = (view: 'map' | 'list') => {
    if (isHomePage) {
      dispatch(setHomeView(view));
    } else {
      dispatch(setHomeView(view));
      navigate('/');
    }
  };


  // Hide navigation during maintenance mode
  if (isMaintenanceMode) {
    return null;
  }

  return (
    <>
      {/* Wind Direction Filter */}
      {showWindFilter && (
        <div ref={windFilterRef}>
          <WindDirectionFilter onClose={() => setShowWindFilter(false)} />
        </div>
      )}

      <BottomNavigationBar
        isAuthenticated={isAuthenticated}
        isHomePage={isHomePage}
        isListView={isListView}
        filter={filter}
        onViewToggle={handleViewToggle}
        onWindFilterToggle={() => setShowWindFilter(true)}
        showWindFilter={showWindFilter}
      />
    </>
  );
};
