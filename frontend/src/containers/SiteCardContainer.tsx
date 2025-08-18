import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SiteCard } from '@components/site/SiteCard';
import { DeleteConfirmDialogContainer } from '@containers/DeleteConfirmDialogContainer';
import type { SiteCardContainerProps, DeleteDialogState } from '@app-types';

export const SiteCardContainer: React.FC<SiteCardContainerProps> = ({ site }) => {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Event handlers
  const handleEdit = () => {
    navigate(`/edit-site/${site._id}`);
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const handleViewDetails = () => {
    navigate(`/парапланер-старт/${site.url}`);
  };

  const handleShowOnMap = () => {
    if (site.location?.coordinates) {
      const [lng, lat] = site.location.coordinates;
      const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
      window.open(googleMapsUrl, '_blank');
    }
  };

  const deleteDialog: DeleteDialogState = {
    isOpen: deleteDialogOpen,
    onClose: () => setDeleteDialogOpen(false),
    onConfirm: () => setDeleteDialogOpen(false), // This will be handled by DeleteConfirmDialogContainer
  };

  return (
    <>
      <SiteCard
        site={site}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewDetails={handleViewDetails}
        onShowOnMap={handleShowOnMap}
        deleteDialog={deleteDialog}
      />

      {/* Delete confirmation dialog */}
      <DeleteConfirmDialogContainer
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        siteId={site._id}
        title={site.title?.bg || site.title?.en || 'Неизвестен старт'}
      />
    </>
  );
};
