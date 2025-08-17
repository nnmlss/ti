import { lazy, Suspense } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import type { SitesMapProps } from '@app-types';

// Lazy load the SitesMap component to avoid loading Leaflet unless needed
const SitesMap = lazy(() => 
  import('./SitesMap').then(module => ({ default: module.SitesMap }))
);

const MapLoadingFallback = () => (
  <Box
    sx={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <CircularProgress disableShrink />
  </Box>
);

export function LazyMap(props: SitesMapProps) {
  return (
    <Suspense fallback={<MapLoadingFallback />}>
      <SitesMap {...props} />
    </Suspense>
  );
}