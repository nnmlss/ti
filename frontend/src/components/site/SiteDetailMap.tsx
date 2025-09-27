import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
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

// Component to handle map resize when fullscreen toggles
function MapResizeHandler({ isFullscreen }: { isFullscreen: boolean }) {
  const map = useMap();

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => clearTimeout(timer);
  }, [isFullscreen, map]);

  return null;
}

export function SiteDetailMap({
  coordinates,
  markerTitle,
  zoom = 12,
  isFullscreen,
  onToggleFullscreen,
}: SiteDetailMapProps) {
  const [lat, lng] = coordinates;

  return (
    <Box
      sx={{
        position: isFullscreen ? 'fixed' : 'relative',
        top: isFullscreen ? 0 : 'auto',
        left: isFullscreen ? 0 : 'auto',
        width: isFullscreen ? '100vw' : '100%',
        height: isFullscreen ? '100vh' : '0',
        aspectRatio: isFullscreen ? 'unset' : '16/9',
        zIndex: isFullscreen ? 9999 : 'auto',
        borderRadius: isFullscreen ? 0 : 1,
        overflow: isFullscreen ? 'visible' : 'hidden',
        boxShadow: 1,
        backgroundColor: '#fff',
        '& .leaflet-container': {
          width: '100%',
          height: '100%',
        },
      }}
    >
      {/* Fullscreen toggle button */}
      <IconButton
        onClick={onToggleFullscreen}
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 1000,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 1)',
          },
        }}
        size='small'
      >
        {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
      </IconButton>
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
        {/* Component to handle map resize */}
        <MapResizeHandler isFullscreen={isFullscreen} />

        {/* OpenStreetMap tile layer */}
        <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />

        {/* Single marker for current site */}
        <Marker
          position={[lat, lng]}
          eventHandlers={{
            add: (e) => {
              e.target.openPopup();
            },
          }}
        >
          <Popup closeButton={false} autoClose={false} closeOnClick={false}>
            {markerTitle}
          </Popup>
        </Marker>
      </MapContainer>
    </Box>
  );
}
