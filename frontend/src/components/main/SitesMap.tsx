import { useSites } from '../../hooks/useSites';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, LayersControl } from 'react-leaflet';
import {
  CircularProgress,
  Alert,
  Box,
  Card,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { SiteCardContent } from '../site/SiteCardContent';
import { DeleteConfirmDialog } from '../ui/DeleteConfirmDialog';
import { useConfirmDialog } from '../../hooks/useConfirmDialog';
import { useDispatch } from 'react-redux';
import { deleteSiteThunk } from '../../store/thunks/sitesThunks';
import { dispatchThunkWithCallback } from '../../store/utils/thunkWithCallback';
import type { AppDispatch } from '../../store/store';
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

export function SitesMap() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isOpen, targetId, confirm, handleConfirm, handleCancel } = useConfirmDialog();
  const { sites, allSitesLoadState } = useSites();
  const loading = allSitesLoadState.status;
  const error = allSitesLoadState.error;

  const handleDelete = async (siteId: number) => {
    await dispatchThunkWithCallback(dispatch, {
      thunkAction: deleteSiteThunk(siteId),
      onSuccess: () => {
        handleCancel(); // Close the confirmation dialog
      },
    });
  };

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
              return [acc[0] + lat!, acc[1] + lng!];
            },
            [0, 0]
          )
          .map((sum) => sum / sitesWithCoordinates.length) as [number, number])
      : defaultCenter;

  return (
    <>
      <MapContainer center={mapCenter} zoom={8} style={{ height: '100vh', width: '100vw' }}>
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
              <Tooltip
                key={`tooltip-${site._id}`}
                permanent
                direction='top'
                offset={[-15, -7]}
                opacity={1}
              >
                {site.title.bg}
              </Tooltip>
              <Popup maxWidth={280} minWidth={260}>
                <Card sx={{ width: '100%', boxShadow: 'none', border: 'none', p: 0, m: 0 }}>
                  <SiteCardContent
                    site={site}
                    onEdit={() => navigate(`/edit-site/${site._id}`)}
                    onDelete={() => confirm(site._id, () => handleDelete(site._id))}
                    onViewDetails={() => navigate(`/site/${site._id}`)}
                    onShowOnMap={() => {
                      const [lng, lat] = site.location.coordinates;
                      window.open(`https://maps.google.com/maps?q=${lat},${lng}`, '_blank');
                    }}
                    variant="popup"
                    compassSize={60}
                  />
                </Card>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {isOpen && targetId && (
        <DeleteConfirmDialog
          open={isOpen}
          onClose={handleCancel}
          siteId={targetId}
          title={sites?.find((s) => s._id === targetId)?.title.bg || 'this site'}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
}
