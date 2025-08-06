import { Card, CardContent, Typography, CardActions, Button } from '@mui/material';

import { Link } from 'react-router-dom';
import type { FlyingSite } from '../types';
import { WindDirectionCompass } from './WindDirectionCompass';

interface SiteCardProps {
  site: FlyingSite;
}

export function SiteCard({ site }: SiteCardProps) {
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
      <CardContent>
        <Typography variant='h5' component='div' sx={{ mb: 1.5 }}>
          {site.title.bg}
          {site.title.bg && site.title.en ? <br /> : ''}
          {site.title.en}
        </Typography>
        <WindDirectionCompass
          windDirections={site.windDirection}
          size={75}
          showLabels={false}
        />
        <Typography variant='body2'>
          Altitude: {site.altitude ? `${site.altitude}m` : 'N/A'}
        </Typography>
      </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button component={Link} to={`/edit-site/${site._id}`} size='small'>
          Edit
        </Button>
        <Button component={Link} to={`/edit-site/${site._id}`} color='error' size='small'>
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}
