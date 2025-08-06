import { useNavigate } from 'react-router-dom';
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
import { Map } from '@mui/icons-material';
import type { FlyingSite } from '../types';
import { WindDirectionCompass } from './WindDirectionCompass';
import { AccessOptionsView } from './AccessOptionsView';

interface SiteCardProps {
  site: FlyingSite;
}

export function SiteCard({ site }: SiteCardProps) {
  const navigate = useNavigate();
  return (
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
      </CardContent>
      <Divider />
      <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button component={Link} to={`/edit-site/${site._id}`} size='small'>
          Edit
        </Button>
        <Button
          onClick={() => {
            const [lng, lat] = site.location.coordinates;
            window.open(`https://maps.google.com/maps?q=${lat},${lng}`, '_blank');
          }}
        >
          <Map sx={{ mr: 1 }} /> Google Maps
        </Button>
        <Button component={Link} to={`/edit-site/${site._id}`} color='error' size='small'>
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}
