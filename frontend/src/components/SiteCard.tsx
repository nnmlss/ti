import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
  Divider,
} from '@mui/material';

import { Link } from 'react-router-dom';
// import { Map } from '@mui/icons-material';
import LocationPinIcon from '@mui/icons-material/LocationPin';
// import GpsFixedIcon from '@mui/icons-material/GpsFixed';
// import GpsOffIcon from '@mui/icons-material/GpsOff';

import type { FlyingSite } from '../types';
import { WindDirectionCompass } from './WindDirectionCompass';
import { AccessOptionsView } from './AccessOptionsView';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { useDeleteSiteMutation } from '../store/apiSlice';
import { useSites } from '../hooks/useSites';

interface SiteCardProps {
  site: FlyingSite;
}

export function SiteCard({ site }: SiteCardProps) {
  const navigate = useNavigate();
  const [deleteSite] = useDeleteSiteMutation();
  const { deleteSite: deleteFromState } = useSites();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteConfirm = async () => {
    try {
      await deleteSite(site._id).unwrap();
      deleteFromState(site._id);
    } catch (error) {
      console.error('Failed to delete site:', error);
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <Card
        sx={{
          mb: 2,
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <CardContent
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            cursor: 'pointer',
          }}
          onClick={() => navigate(`/site/${site._id}`)}
        >
          <Typography
            variant='h5'
            component='div'
            sx={{ mb: 1.5, textAlign: 'center', color: 'primary.light' }}
          >
            {site.title.bg}
            <Typography variant='h6' component='div' sx={{ textAlign: 'center' }}>
              {site.title.en}
            </Typography>
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <WindDirectionCompass
              windDirections={site.windDirection}
              size={75}
              showLabels={false}
            />
            <Typography variant='body2' sx={{ textAlign: 'center', mt: 2 }}>
              {site.altitude ? `${site.altitude}m` : 'N/A'}
            </Typography>
          </Box>
          <AccessOptionsView accessOptions={site.accessOptions} size={46} />
          <Button
            onClick={() => {
              const [lng, lat] = site.location.coordinates;
              window.open(`https://maps.google.com/maps?q=${lat},${lng}`, '_blank');
            }}
          >
            Отвори <LocationPinIcon sx={{ mr: 0 }} />в Google Maps
          </Button>
        </CardContent>
        <Divider />
        <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button component={Link} to={`/edit-site/${site._id}`} size='small'>
            Промяна
          </Button>

          <Button onClick={() => setIsDeleteDialogOpen(true)} color='error' size='small'>
            Изтриване
          </Button>
        </CardActions>
      </Card>
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title={site.title.bg || site.title.en || 'this site'}
      />
    </>
  );
}
