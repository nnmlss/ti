import { useState } from 'react';

export interface NotificationState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  onAutoClose?: () => void;
}

export const useNotificationDialog = () => {
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    message: '',
    severity: 'info',
    title: undefined,
  });

  const showNotification = (
    message: string,
    severity: 'success' | 'error' | 'info' | 'warning' = 'info',
    title?: string,
    onAutoClose?: () => void
  ) => {
    setNotification({
      open: true,
      message,
      severity,
      title,
      onAutoClose,
    });
  };

  const hideNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  const showSuccess = (message: string, title?: string, onAutoClose?: () => void) => {
    showNotification(message, 'success', title, onAutoClose);
  };

  const showError = (message: string, title?: string, onAutoClose?: () => void) => {
    showNotification(message, 'error', title, onAutoClose);
  };

  const showInfo = (message: string, title?: string, onAutoClose?: () => void) => {
    showNotification(message, 'info', title, onAutoClose);
  };

  const showWarning = (message: string, title?: string, onAutoClose?: () => void) => {
    showNotification(message, 'warning', title, onAutoClose);
  };

  return {
    notification,
    showNotification,
    hideNotification,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };
};
