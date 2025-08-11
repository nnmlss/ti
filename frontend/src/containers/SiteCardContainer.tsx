import { useNavigate } from 'react-router-dom';
import { useConfirmDialog } from '../hooks/useConfirmDialog';
import { useDeleteSiteMutation } from '../store/apiSlice';
import { SiteCard } from '../components/SiteCard';
import type { FlyingSite } from '../types';

interface SiteCardContainerProps {
  site: FlyingSite;
}

export function SiteCardContainer({ site }: SiteCardContainerProps) {
  const navigate = useNavigate();
  const { isOpen, targetId, confirm, handleConfirm, handleCancel } = useConfirmDialog();
  const [deleteSite] = useDeleteSiteMutation();

  const handleDelete = async () => {
    try {
      await deleteSite(site._id).unwrap();
    } catch (error) {
      console.error('Failed to delete site:', error);
    }
  };

  const handleEdit = () => {
    navigate(`/edit-site/${site._id}`);
  };

  const handleViewDetails = () => {
    navigate(`/site/${site._id}`);
  };

  const handleShowOnMap = () => {
    const [lng, lat] = site.location.coordinates;
    window.open(`https://maps.google.com/maps?q=${lat},${lng}`, '_blank');
  };

  const handleDeleteClick = () => {
    confirm(site._id, handleDelete);
  };

  return (
    <SiteCard
      site={site}
      onEdit={handleEdit}
      onDelete={handleDeleteClick}
      onViewDetails={handleViewDetails}
      onShowOnMap={handleShowOnMap}
      deleteDialog={{
        isOpen: isOpen && targetId === site._id,
        onClose: handleCancel,
        onConfirm: handleConfirm,
      }}
    />
  );
}