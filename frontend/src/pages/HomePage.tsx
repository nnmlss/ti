import { useGetSitesQuery } from '../store/apiSlice';
import { SiteCard } from '../components/SiteCard';
import { Container, Typography, CircularProgress, Alert, Button, Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export function HomePage() {
  const { data: sites, error, isLoading } = useGetSitesQuery();

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity='error'>Error loading sites!</Alert>;
  }

  return (
    <Container
      maxWidth='md'
      sx={{ border: '1px dotted white', justifyContent: 'space-between' }}
    >
      <Box sx={{ my: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='h4' component='h1' gutterBottom sx={{ mt: 2 }}>
          Flying Sites
        </Typography>

        <Button
          component={Link}
          to='/add-site'
          variant='contained'
          startIcon={<AddCircleOutlineIcon />}
        >
          Add New Site
        </Button>
      </Box>
      <Grid container spacing={2} justifyContent='flex-start' alignItems='stretch'>
        {sites &&
          sites.map((site, index) => (
            <Grid
              size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}
              key={index}
              sx={{ display: 'flex', aspectRatio: '2/3' }}
            >
              <SiteCard site={site} />
            </Grid>
          ))}
      </Grid>
    </Container>
  );
}
