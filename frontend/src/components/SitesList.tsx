import { useGetSitesQuery } from '../store/apiSlice';
import { useSites } from '../hooks/useSites';
import { SiteCard } from './SiteCard';
import { CircularProgress, Alert } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useEffect } from 'react';

export function SitesList() {
  const { data: sites, error, isLoading } = useGetSitesQuery(undefined, {
    pollingInterval: 30000, // Refetch every 30 seconds
    refetchOnFocus: true,   // Refetch when user returns to tab
    refetchOnReconnect: true, // Refetch on network reconnection
  });
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
    <Grid container spacing={2} justifyContent='flex-start' alignItems='stretch'>
      {sites &&
        sites.map((site, index) => (
          <Grid
            size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 3 }}
            key={index}
            sx={{ display: 'flex', aspectRatio: '2/3.2' }}
          >
            <SiteCard site={site} />
          </Grid>
        ))}
    </Grid>
  );
}