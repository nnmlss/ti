import { SitesList } from '../components/SitesList';
import { Container, Typography, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export function HomePage() {
  return (
    <Container
      maxWidth={false}
      sx={{ border: '1px dotted white', justifyContent: 'space-between' }}
    >
      <Grid container sx={{ my: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='h4' component='h1' gutterBottom sx={{ mt: 2 }}>
          Места за летене
        </Typography>

        <Button
          component={Link}
          to='/add-site'
          variant='contained'
          startIcon={<AddCircleOutlineIcon />}
        >
          добави старт
        </Button>
      </Grid>
      <SitesList />
    </Container>
  );
}
