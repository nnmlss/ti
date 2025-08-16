import { useModal } from '@hooks/ui/useModal';

export function useAddSitePage() {
  const { handleClose } = useModal(true);

  return {
    onClose: handleClose,
  };
}
