import { useSites } from '@hooks/business/useSites';
import { SiteCardContainer } from '@containers/SiteCardContainer';
import { CircularProgress, Alert, Box } from '@mui/material';
import Grid from '@mui/material/Grid';

export function SitesList() {
  const { sites, allSitesLoadState } = useSites();
  const loading = allSitesLoadState.status;
  const error = allSitesLoadState.error;

  if (loading === 'pending' && sites.length === 0) {
    return (
      <Box
        sx={{
          height: '70vh',
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
    return <Alert severity='error'>{error}</Alert>;
  }

  return (
    <Grid
      container
      spacing={2}
      justifyContent='flex-start'
      alignItems='stretch'
      sx={{ p: 2, pb: 10 }}
    >
      {sites &&
        sites.map((site, index) => (
          <Grid
            size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}
            key={index}
            sx={{ display: 'flex', aspectRatio: '2/3.2' }}
          >
            <SiteCardContainer site={site} />
          </Grid>
        ))}
    </Grid>
  );
}
