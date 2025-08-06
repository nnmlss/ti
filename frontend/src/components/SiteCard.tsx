import { Card, CardContent, Typography, CardActions, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import type { FlyingSite } from '../types';

interface SiteCardProps {
  site: FlyingSite;
}

export function SiteCard({ site }: SiteCardProps) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant='h5' component='div'>
          {site.title.bg}
          {site.title.bg && site.title.en ? ' / ' : ''}
          {site.title.en}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color='text.secondary'>
          Wind Directions: {site.windDirection.join(', ')}
        </Typography>
        <Typography variant='body2'>
          Altitude: {site.altitude ? `${site.altitude}m` : 'N/A'}
        </Typography>
      </CardContent>
      <CardActions>
        <Button component={Link} to={`/edit-site/${site._id}`} size='small'>
          Edit
        </Button>
      </CardActions>
    </Card>
  );
}
