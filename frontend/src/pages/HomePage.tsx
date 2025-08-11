import { SitesMap } from '../components/SitesMap';
import { SitesList } from '../components/SitesList';
import { WindDirectionFilter } from '../components/WindDirectionFilter';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useGetSitesQuery } from '../store/apiSlice';
import { useSites } from '../hooks/useSites';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import MapIcon from '@mui/icons-material/Map';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AirIcon from '@mui/icons-material/Air';

export function HomePage() {
  const [showWindFilter, setShowWindFilter] = useState(false);
  
  // Centralized data fetching for both map and list views
  const { data: sites, error, isLoading } = useGetSitesQuery(undefined, {
    pollingInterval: 30000, // Refetch every 30 seconds
    refetchOnFocus: true,   // Refetch when user returns to tab
    refetchOnReconnect: true, // Refetch on network reconnection
  });
  const { setSites, setLoading, setError, homeView, setHomeView, filter } = useSites();
  const isListView = homeView === 'list';

  // Sync RTK Query data to sitesSlice once at the top level
  useEffect(() => {
    if (sites) {
      setSites(sites);
    }
    setLoading(isLoading);
    if (error) {
      setError('Error loading sites!');
    } else {
      setError(null);
    }
  }, [sites, isLoading, error, setSites, setLoading, setError]);

  return (
    <Box sx={{ position: 'relative', height: '100vh', width: '100vw' }}>
      {/* Floating header with title and add button */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1001,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(8px)',
          borderRadius: 1,
          px: 3,
          py: 2,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        }}
      >
        <Typography variant='h5' component='h1' sx={{ color: 'primary.main', display: { xs: 'none', sm: 'block' } }}>
          Места за летене
        </Typography>
        <Box>
          <IconButton 
            onClick={() => setShowWindFilter(!showWindFilter)}
            sx={{ color: filter.windDirection ? 'primary.main' : 'inherit' }}
          >
            <AirIcon />
          </IconButton>
          <IconButton onClick={() => setHomeView('map')} sx={{ color: !isListView ? 'primary.main' : 'inherit' }}>
            <MapIcon />
          </IconButton>
          <IconButton onClick={() => setHomeView('list')} sx={{ color: isListView ? 'primary.main' : 'inherit' }}>
            <FormatListBulletedIcon />
          </IconButton>
        </Box>
        <Box>
          <Button
            component={Link}
            to='/add-site'
            variant='contained'
            startIcon={<AddCircleOutlineIcon />}
          >
            добави старт
          </Button>
        </Box>
      </Box>

      {/* Wind Direction Filter */}
      {showWindFilter && (
        <WindDirectionFilter onClose={() => setShowWindFilter(false)} />
      )}

      {/* Conditional content */}
      {isListView ? <SitesList /> : <SitesMap />}
    </Box>
  );
}
