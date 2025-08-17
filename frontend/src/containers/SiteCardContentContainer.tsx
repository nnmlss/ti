import React from 'react';
import { SiteCardContent } from '@components/site/SiteCardContent';
import { useSiteCardContent } from '@hooks/ui/useSiteCardContent';
import type { SiteCardContentProps } from '@app-types';

type SiteCardContentContainerProps = Omit<SiteCardContentProps, 'isAuthenticated' | 'isPopup'>;

export const SiteCardContentContainer: React.FC<SiteCardContentContainerProps> = ({
  site,
  onEdit,
  onDelete,
  onViewDetails,
  onShowOnMap,
  variant = 'card',
  compassSize = 75,
}) => {
  const { isAuthenticated } = useSiteCardContent();

  // Derived state
  const isPopup = variant === 'popup';

  // Event handlers with business logic
  const handleShowOnMap = (e?: React.MouseEvent) => {
    if (isPopup && e) {
      e.stopPropagation();
    }
    onShowOnMap();
  };

  const handleEdit = (e?: React.MouseEvent) => {
    if (isPopup && e) {
      e.stopPropagation();
    }
    onEdit();
  };

  const handleDelete = (e?: React.MouseEvent) => {
    if (isPopup && e) {
      e.stopPropagation();
    }
    onDelete();
  };

  return (
    <SiteCardContent
      site={site}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onViewDetails={onViewDetails}
      onShowOnMap={handleShowOnMap}
      variant={variant}
      compassSize={compassSize}
      isAuthenticated={isAuthenticated}
      isPopup={isPopup}
    />
  );
};
