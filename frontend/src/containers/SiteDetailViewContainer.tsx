import { SiteDetailView } from '@components/site/SiteDetailView';
import type { SiteDetailViewContainerProps } from '@app-types';

export function SiteDetailViewContainer({ site }: SiteDetailViewContainerProps) {
  const handleOpenLocation = (coordinates: [number, number]) => {
    const [lng, lat] = coordinates;
    window.open(`https://maps.google.com/maps?q=${lat},${lng}`, '_blank');
  };

  const handleOpenTracklog = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <SiteDetailView
      site={site}
      onOpenLocation={handleOpenLocation}
      onOpenTracklog={handleOpenTracklog}
    />
  );
}