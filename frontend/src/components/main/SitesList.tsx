import { SiteCardContainer } from '@containers/SiteCardContainer';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import type { SitesListProps } from '@app-types';

export function SitesList({ sites, loading, error }: SitesListProps) {
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
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(172px, 1fr))',
        gap: { xs: 0.5, sm: 0.7, md: 1 },
        p: { xs: 0.5, sm: 0.7, md: 2 },
        pb: 10,
        mb: 20,
      }}
    >
      {sites &&
        sites.map((site, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              aspectRatio: '2/3.2',
            }}
          >
            <SiteCardContainer site={site} />
          </Box>
        ))}
    </Box>
  );
}
