import { MapContainer, TileLayer, Marker, Popup, Tooltip, LayersControl } from 'react-leaflet';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
// Labels toggle functionality moved to BottomBar
import { useSelector } from 'react-redux';
import type { RootState } from '@store/store';
import { SiteCardContent } from '@components/site/SiteCardContent';
import { DeleteConfirmDialogContainer as DeleteConfirmDialog } from '@containers/DeleteConfirmDialogContainer';
import type { SitesMapProps } from '@app-types';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
// TypeScript doesn't know about the internal _getIconUrl property
delete (L.Icon.Default.prototype as { _getIconUrl?: () => string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export function SitesMap({
  sites,
  loading,
  error,
  onEdit,
  onDelete,
  onViewDetails,
  onShowOnMap,
  deleteDialog,
}: SitesMapProps) {
  const showLabels = useSelector((state: RootState) => state.mapLabels.showLabels);
  if (loading === 'pending' && sites.length === 0) {
    return (
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
  }

  if (error) {
    return (
      <Box
        sx={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Alert severity='error'>Error loading sites!</Alert>
      </Box>
    );
  }

  // Filter sites with valid coordinates
  const sitesWithCoordinates =
    sites?.filter(
      (site) =>
        site.location?.coordinates &&
        site.location.coordinates[0] !== null &&
        site.location.coordinates[1] !== null
    ) || [];

  // Calculate center of Bulgaria as default center
  const defaultCenter: [number, number] = [42.7339, 25.4858]; // Center of Bulgaria

  // If we have sites, calculate center based on them
  const mapCenter =
    sitesWithCoordinates.length > 0
      ? (sitesWithCoordinates
          .reduce(
            (acc, site) => {
              const [lng, lat] = site.location.coordinates;
              return [acc[0]! + lat, acc[1]! + lng];
            },
            [0, 0]
          )
          .map((sum) => sum / sitesWithCoordinates.length) as [number, number])
      : defaultCenter;

  return (
    <>
      {/* Labels toggle moved to BottomBar */}

      <MapContainer center={mapCenter} zoom={8} style={{ height: '100vh', width: '100vw' }}>
        {/* Restore LayersControl positioned below our custom controls */}
        <LayersControl position='topright'>
          <LayersControl.BaseLayer checked name='Terrain'>
            <TileLayer
              attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
              url='https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
              maxZoom={17}
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name='Satellite'>
            <TileLayer
              attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name='Open Street Map'>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {sitesWithCoordinates.map((site) => {
          const [lng, lat] = site.location.coordinates;
          return (
            <Marker key={site._id} position={[lat!, lng!]}>
              {showLabels && (
                <Tooltip
                  key={`tooltip-${site._id}`}
                  permanent
                  direction='top'
                  offset={[-15, -7]}
                  opacity={1}
                >
                  {site.title.bg}
                </Tooltip>
              )}
              <Popup maxWidth={280} minWidth={260}>
                <Card sx={{ width: '100%', boxShadow: 'none', border: 'none', p: 0, m: 0 }}>
                  <SiteCardContent
                    site={site}
                    onEdit={() => onEdit(site._id)}
                    onDelete={() => onDelete(site._id)}
                    onViewDetails={() => onViewDetails(site)}
                    onShowOnMap={() => onShowOnMap(site.location.coordinates)}
                    variant='popup'
                    compassSize={60}
                  />
                </Card>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {deleteDialog.isOpen && deleteDialog.targetId && (
        <DeleteConfirmDialog
          open={deleteDialog.isOpen}
          onClose={deleteDialog.onClose}
          siteId={deleteDialog.targetId}
          title={deleteDialog.targetTitle}
          onConfirm={deleteDialog.onConfirm}
        />
      )}
    </>
  );
}
