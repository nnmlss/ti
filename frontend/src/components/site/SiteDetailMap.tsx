import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Box from '@mui/material/Box';
import type { SiteDetailMapProps } from '@app-types';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet - reuse from SitesMap
delete (L.Icon.Default.prototype as { _getIconUrl?: () => string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export function SiteDetailMap({ coordinates, siteName, zoom = 15 }: SiteDetailMapProps) {
  const [lat, lng] = coordinates;

  return (
    <Box
      sx={{
        width: '100%',
        aspectRatio: '16/9', // Square map (1:1 ratio)
        // maxWidth: 400,
        // maxHeight: 400,
        borderRadius: 1,
        overflow: 'hidden',
        boxShadow: 1,
        '& .leaflet-container': {
          width: '100%',
          height: '100%',
        },
      }}
    >
      <MapContainer
        center={[lat, lng]}
        zoom={zoom}
        style={{ width: '100%', height: '100%' }}
        zoomControl={true}
        dragging={true}
        touchZoom={true}
        doubleClickZoom={true}
        scrollWheelZoom={true}
        boxZoom={true}
        keyboard={true}
        attributionControl={true}
      >
        {/* Satellite tile layer - same as main map */}
        <TileLayer url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' />

        {/* Single marker for current site */}
        <Marker
          position={[lat, lng]}
          eventHandlers={{
            add: (e) => {
              e.target.openPopup();
            }
          }}
        >
          <Popup closeButton={false} autoClose={false} closeOnClick={false}>
            {siteName}
          </Popup>
        </Marker>
      </MapContainer>
    </Box>
  );
}
