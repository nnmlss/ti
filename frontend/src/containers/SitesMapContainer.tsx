import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useConfirmDialog } from '@hooks/ui/useConfirmDialog';
import { useSites } from '@hooks/business/useSites';
import { deleteSiteThunk } from '@store/thunks/sitesThunks';
import { dispatchThunkWithCallback } from '@store/utils/thunkWithCallback';
import type { AppDispatch } from '@store/store';
import type { FlyingSite } from '@app-types';
import { LazyMap as SitesMap } from '@components/main/LazyMap';
import { getSiteUrl } from '@utils/slugUtils';

export function SitesMapContainer() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isOpen, targetId, confirm, handleConfirm, handleCancel } = useConfirmDialog();
  const { sites, allSitesLoadState } = useSites();

  const handleDelete = async (siteId: number) => {
    await dispatchThunkWithCallback(dispatch, {
      thunkAction: deleteSiteThunk(siteId),
      onSuccess: () => {
        handleCancel();
      },
    });
  };

  const handleEdit = (siteId: number) => {
    navigate(`/edit-site/${siteId}`);
  };

  const handleViewDetails = (site: FlyingSite) => {
    navigate(getSiteUrl(site));
  };

  const handleShowOnMap = (coordinates: [number, number]) => {
    const [lng, lat] = coordinates;
    window.open(`https://maps.google.com/maps?q=${lat},${lng}`, '_blank');
  };

  const handleDeleteClick = (siteId: number) => {
    confirm(siteId, () => handleDelete(siteId));
  };

  return (
    <SitesMap
      sites={sites}
      loading={allSitesLoadState.status}
      error={allSitesLoadState.error}
      onEdit={handleEdit}
      onDelete={handleDeleteClick}
      onViewDetails={handleViewDetails}
      onShowOnMap={handleShowOnMap}
      deleteDialog={{
        isOpen,
        targetId,
        onClose: handleCancel,
        onConfirm: handleConfirm,
        targetTitle: sites?.find((s) => s._id === targetId)?.title.bg || 'this site',
      }}
    />
  );
}
