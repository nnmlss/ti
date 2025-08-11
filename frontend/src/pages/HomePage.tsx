import { SitesMap } from '../components/SitesMap';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import MapIcon from '@mui/icons-material/Map';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AirIcon from '@mui/icons-material/Air';

export function HomePage() {
  return (
    <Box sx={{ position: 'relative', height: '100vh', width: '100vw' }}>
      {/* Floating header with title and add button */}
      <Box
        sx={{
          position: 'absolute',
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
        <Typography variant='h5' component='h1' sx={{ color: 'primary.main' }}>
          Места за летене
        </Typography>
        <Box>
          <IconButton component={Link} to='/'>
            <AirIcon />
          </IconButton>
          <IconButton component={Link} to='/'>
            <MapIcon />
          </IconButton>
          <IconButton component={Link} to='/'>
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

      {/* Full screen map */}
      <SitesMap />
    </Box>
  );
}
