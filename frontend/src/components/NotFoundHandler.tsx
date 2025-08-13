import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { showErrorNotification } from '../store/slices/errorNotificationSlice';
import type { AppDispatch } from '../store/store';

export function NotFoundHandler() {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();

  useEffect(() => {
    // Show error notification for 404 - but don't auto-redirect
    dispatch(showErrorNotification({
      title: 'Страницата не е намерена',
      message: `Страницата "${location.pathname}" не съществува.`
    }));
  }, [dispatch, location.pathname]);

  // Return null since we're just handling the error notification
  return null;
}