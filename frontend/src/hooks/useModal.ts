import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { navigateToHome } from '../utils/navigation';

export interface ModalState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  handleClose: () => void;
}

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