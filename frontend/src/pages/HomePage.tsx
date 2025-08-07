import { useGetSitesQuery } from '../store/apiSlice';
import { useSites } from '../hooks/useSites';
import { SiteCard } from '../components/SiteCard';
import { Container, Typography, CircularProgress, Alert, Button, Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useEffect } from 'react';

export function HomePage() {
  const { data: sites, error, isLoading } = useGetSitesQuery();
  const { setSites, setLoading, setError } = useSites();

  // Sync RTK Query data to sitesSlice
  useEffect(() => {
    if (sites) {
      setSites(sites);
    }
  }, [sites, setSites]);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  useEffect(() => {
    if (error) {
      setError('Error loading sites!');
    } else {
      setError(null);
    }
  }, [error, setError]);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity='error'>Error loading sites!</Alert>;
  }

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
      <Grid container spacing={2} justifyContent='flex-start' alignItems='stretch'>
        {sites &&
          sites.map((site, index) => (
            <Grid
              size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 3 }}
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
