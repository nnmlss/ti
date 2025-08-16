import type { ComponentProps } from 'react';
import { Dialog } from '@mui/material';

// ===== DIALOG COMPONENT TYPES =====
export interface AccessibleDialogProps extends Omit<ComponentProps<typeof Dialog>, 'aria-labelledby' | 'aria-describedby'> {
  // Accessibility props
  title?: string;
  description?: string;
  
  // ARIA overrides (optional)
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}

export interface AccessibleDialogRef {
  focus: () => void;
  getDialogElement: () => HTMLElement | null;
}

// ===== NOTIFICATION TYPES =====
export interface NotificationState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  onAutoClose?: () => void;
}

export interface NotificationDialogProps {
  notification: NotificationState;
  onClose: () => void;
}