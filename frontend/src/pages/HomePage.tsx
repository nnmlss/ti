import { useGetSitesQuery } from '../store/apiSlice';
import { SiteCard } from '../components/SiteCard';
import { Container, Typography, CircularProgress, Alert, Button, Box } from '@mui/material';
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
    <Container maxWidth='md'>
      <Typography variant='h4' component='h1' gutterBottom sx={{ mt: 2 }}>
        Flying Sites
      </Typography>
      {sites && sites.map((site) => <SiteCard key={site._id} site={site} />)}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button
          component={Link}
          to='/add-site'
          variant='contained'
          startIcon={<AddCircleOutlineIcon />}
        >
          Add New Site
        </Button>
      </Box>
    </Container>
  );
}
