import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SiteCard } from '@components/site/SiteCard';
import type { SiteCardContainerProps, DeleteDialogState } from '@app-types/components';

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
    navigate(`/sites/${site.url}`);
  };

  const handleShowOnMap = () => {
    if (site.location?.coordinates) {
      const [lng, lat] = site.location.coordinates;
      const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
      window.open(googleMapsUrl, '_blank');
    }
  };

  const handleDeleteConfirm = () => {
    // TODO: Implement actual delete logic here
    console.log('Delete site:', site._id);
    setDeleteDialogOpen(false);
  };

  const deleteDialog: DeleteDialogState = {
    isOpen: deleteDialogOpen,
    onClose: () => setDeleteDialogOpen(false),
    onConfirm: handleDeleteConfirm,
  };

  return (
    <SiteCard
      site={site}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onViewDetails={handleViewDetails}
      onShowOnMap={handleShowOnMap}
      deleteDialog={deleteDialog}
    />
  );
};