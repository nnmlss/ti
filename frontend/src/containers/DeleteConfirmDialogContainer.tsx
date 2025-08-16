import { useDispatch, useSelector } from 'react-redux';
import { deleteSiteThunk } from '@store/thunks/sitesThunks';
import type { RootState, AppDispatch } from '@store/store';
import { dispatchThunkWithCallback } from '@store/utils/thunkWithCallback';
import { useImmediateAsync } from '@hooks/utils/useImmediateAsync';
import { DeleteConfirmDialog } from '@components/ui/DeleteConfirmDialog';
import type { DeleteConfirmDialogContainerProps } from '@types';

export function DeleteConfirmDialogContainer({
  open,
  onClose,
  siteId,
  title,
  onConfirm,
}: DeleteConfirmDialogContainerProps) {
  const dispatch = useDispatch<AppDispatch>();
  const reduxIsDeleting = useSelector(
    (state: RootState) => state.singleSite.delete.status === 'pending'
  );

  const deleteAction = useImmediateAsync({
    externalLoading: reduxIsDeleting,
    onError: (error) => {
      console.error('Failed to delete site:', error);
    },
  });

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      deleteAction.execute(async () => {
        await dispatchThunkWithCallback(dispatch, {
          thunkAction: deleteSiteThunk(siteId),
          onSuccess: () => {
            onClose();
          },
        });
      });
    }
  };

  return (
    <DeleteConfirmDialog
      open={open}
      onClose={onClose}
      title={title}
      isLoading={deleteAction.isLoading}
      onConfirm={handleConfirm}
    />
  );
}