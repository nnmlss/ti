import React from 'react';
import { SiteDetailMap } from '@components/site/SiteDetailMap';
import type { SiteDetailMapContainerProps } from '@app-types';

export function SiteDetailMapContainer({ site }: SiteDetailMapContainerProps) {
  // Extract business logic - coordinate transformation
  const getCoordinates = (): [number, number] => {
    // Site coordinates are stored as [longitude, latitude]
    // Leaflet expects [latitude, longitude]
    const [lng, lat] = site.location.coordinates;
    return [lat, lng];
  };

  // Get site display name
  const getSiteName = (): string => {
    return site.title.bg || site.title.en || 'Unnamed Site';
  };

  return (
    <SiteDetailMap
      coordinates={getCoordinates()}
      siteName={getSiteName()}
      zoom={15}
    />
  );
}