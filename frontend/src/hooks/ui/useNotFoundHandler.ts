import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { showErrorNotification } from '@store/slices/errorNotificationSlice';
import type { AppDispatch } from '@store/store';

export function useNotFoundHandler() {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();

  useEffect(() => {
    dispatch(
      showErrorNotification({
        title: 'Страницата не е намерена',
        message: `Страницата "${location.pathname}" не съществува.`,
      })
    );
  }, [dispatch, location.pathname]);

  return {};
}