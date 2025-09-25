import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { navigateToHome } from '@utils/navigation';
import type { ModalState } from '@app-types';

export const useModal = (
  initialOpen = false,
  onClose?: () => void,
  autoNavigateHome = true
): ModalState => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const navigate = useNavigate();

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    onClose?.();
  };

  const handleClose = () => {
    close();
    if (autoNavigateHome) {
      navigate(navigateToHome());
    }
  };

  return {
    isOpen,
    open,
    close,
    handleClose,
  };
};
