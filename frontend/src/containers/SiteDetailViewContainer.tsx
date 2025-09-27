import { useNavigate } from 'react-router-dom';
import { SiteDetailView } from '@components/site/SiteDetailView';
import { useAuth } from '@hooks/auth/useAuth';
import type { SiteDetailViewContainerProps } from '@app-types';

export function SiteDetailViewContainer({ site, onClose }: SiteDetailViewContainerProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const handleOpenLocation = (coordinates: [number, number]) => {
    const [lng, lat] = coordinates;
    window.open(`https://maps.google.com/maps?q=${lat},${lng}`, '_blank');
  };

  const handleOpenTracklog = (url: string) => {
    window.open(url, '_blank');
  };

  const handleEdit = () => {
    navigate(`/edit-site/${site._id}`);
  };

  return (
    <SiteDetailView
      site={site}
      onOpenLocation={handleOpenLocation}
      onOpenTracklog={handleOpenTracklog}
      onClose={onClose}
      onEdit={handleEdit}
      isAuthenticated={!!user && user.isActive}
    />
  );
}