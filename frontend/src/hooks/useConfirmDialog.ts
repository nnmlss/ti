import { useState, useCallback } from 'react';

export interface ConfirmDialogState {
  isOpen: boolean;
  targetId: string | null;
  confirm: (id: string, action: () => void | Promise<void>) => void;
  handleConfirm: () => void;
  handleCancel: () => void;
}

export const useConfirmDialog = (): ConfirmDialogState => {
  const [isOpen, setIsOpen] = useState(false);
  const [targetId, setTargetId] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<(() => void | Promise<void>) | null>(null);

  const confirm = useCallback((id: string, action: () => void | Promise<void>) => {
    setTargetId(id);
    setPendingAction(() => action);
    setIsOpen(true);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (pendingAction) {
      await pendingAction();
    }
    setIsOpen(false);
    setTargetId(null);
    setPendingAction(null);
  }, [pendingAction]);

  const handleCancel = useCallback(() => {
    setIsOpen(false);
    setTargetId(null);
    setPendingAction(null);
  }, []);

  return {
    isOpen,
    targetId,
    confirm,
    handleConfirm,
    handleCancel,
  };
};