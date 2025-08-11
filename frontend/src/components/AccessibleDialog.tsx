import { useId, forwardRef, useImperativeHandle, useRef } from 'react';
import {
  Dialog,
} from '@mui/material';
import type { ComponentProps } from 'react';

// Simplified Accessible Dialog using MUI's built-in accessibility features
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

export const AccessibleDialog = forwardRef<AccessibleDialogRef, AccessibleDialogProps>(
  (
    {
      title,
      description,
      children,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      ...dialogProps
    },
    ref
  ) => {
    const dialogRef = useRef<HTMLDivElement>(null);
    const dialogId = useId();
    const titleId = title ? `${dialogId}-title` : undefined;
    const descriptionId = description ? `${dialogId}-description` : undefined;
    
    // Determine ARIA attributes
    const computedAriaLabelledBy = ariaLabelledBy || titleId;
    const computedAriaDescribedBy = ariaDescribedBy || descriptionId;

    // Imperative handle for ref access
    useImperativeHandle(ref, () => ({
      focus: () => {
        if (dialogRef.current) {
          dialogRef.current.focus();
        }
      },
      getDialogElement: () => dialogRef.current,
    }), []);

    return (
      <Dialog
        {...dialogProps}
        ref={dialogRef}
        // Proper ARIA attributes
        aria-labelledby={computedAriaLabelledBy}
        aria-describedby={computedAriaDescribedBy}
        aria-label={!computedAriaLabelledBy ? (ariaLabel || 'Dialog') : undefined}
        // Let MUI handle all the accessibility features
        PaperProps={{
          ...dialogProps.PaperProps,
          // Ensure the dialog paper has proper focus management
          id: dialogId,
        }}
      >
        {/* Hidden title for screen readers if provided and not already in content */}
        {title && !ariaLabelledBy && (
          <span
            id={titleId}
            style={{
              position: 'absolute',
              left: '-10000px',
              width: '1px',
              height: '1px',
              overflow: 'hidden',
            }}
          >
            {title}
          </span>
        )}
        
        {/* Hidden description for screen readers if provided and not already in content */}
        {description && !ariaDescribedBy && (
          <span
            id={descriptionId}
            style={{
              position: 'absolute',
              left: '-10000px',
              width: '1px',
              height: '1px',
              overflow: 'hidden',
            }}
          >
            {description}
          </span>
        )}
        
        {children}
      </Dialog>
    );
  }
);

AccessibleDialog.displayName = 'AccessibleDialog';