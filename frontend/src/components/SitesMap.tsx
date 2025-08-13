import { useSites } from '../hooks/useSites';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import {
  CircularProgress,
  Alert,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CardActions,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { WindDirectionCompass } from './WindDirectionCompass';
import { AccessOptionsView } from './AccessOptionsView';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { useConfirmDialog } from '../hooks/useConfirmDialog';
import { useDispatch } from 'react-redux';
import { deleteSiteThunk } from '../store/thunks/sitesThunks';
import type { AppDispatch } from '../store/store';
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
    try {
      await dispatch(deleteSiteThunk(siteId));
    } catch (error) {
      console.error('Failed to delete site:', error);
    }
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
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />

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
                  <CardContent
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      py: 2,
                      px: 1,
                      cursor: 'pointer',
                    }}
                    onClick={() => navigate(`/site/${site._id}`)}
                  >
                    <Typography
                      variant='h6'
                      component='div'
                      sx={{ mb: 1, textAlign: 'center', color: 'primary.light' }}
                    >
                      {site.title.bg}
                      <Typography
                        variant='body1'
                        component='div'
                        sx={{ textAlign: 'center', color: 'text.secondary' }}
                      >
                        {site.title.en}
                      </Typography>
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        mb: 2,
                      }}
                    >
                      <WindDirectionCompass
                        windDirections={site.windDirection}
                        size={60}
                      />
                      <Typography variant='body2' sx={{ textAlign: 'center', mt: 1 }}>
                        {site.altitude ? `${site.altitude}m` : 'N/A'}
                      </Typography>
                    </Box>

                    <AccessOptionsView accessOptions={site.accessOptions} size={36} />

                    <Button
                      size='small'
                      onClick={(e) => {
                        e.stopPropagation();
                        const [lng, lat] = site.location.coordinates;
                        window.open(`https://maps.google.com/maps?q=${lat},${lng}`, '_blank');
                      }}
                      sx={{ mt: 1 }}
                    >
                      <LocationPinIcon sx={{ mr: 0.5 }} />
                      Отвори в Google Maps
                    </Button>
                  </CardContent>

                  <Divider />

                  <CardActions
                    sx={{ display: 'flex', justifyContent: 'space-between', px: 2, py: 1 }}
                  >
                    <Button
                      size='small'
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/edit-site/${site._id}`);
                      }}
                    >
                      <EditIcon />
                    </Button>

                    <Button
                      color='error'
                      size='small'
                      onClick={(e) => {
                        e.stopPropagation();
                        confirm(site._id, () => handleDelete(site._id));
                      }}
                    >
                      <DeleteIcon />
                    </Button>
                  </CardActions>
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
