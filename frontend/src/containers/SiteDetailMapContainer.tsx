import { useState } from 'react';
import { SiteDetailMap } from '@components/site/SiteDetailMap';
import type { SiteDetailMapContainerProps } from '@app-types';

export function SiteDetailMapContainer({ site }: SiteDetailMapContainerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  // Extract business logic - coordinate transformation
  const getCoordinates = (): [number, number] => {
    // Site coordinates are stored as [longitude, latitude]
    // Leaflet expects [latitude, longitude]
    const [lng, lat] = site.location.coordinates;
    return [lat, lng];
  };

  // Get site altitude for display
  const getAltitudeText = (): string => {
    return site.altitude ? `${site.altitude}m` : 'Няма данни за надморска височина';
  };

  // Handle fullscreen toggle
  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <SiteDetailMap
      coordinates={getCoordinates()}
      markerTitle={`${getAltitudeText()} / ${getCoordinates()}`}
      zoom={12}
      isFullscreen={isFullscreen}
      onToggleFullscreen={handleToggleFullscreen}
    />
  );
}
