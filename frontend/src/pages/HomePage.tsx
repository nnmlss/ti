import { SitesMap } from '../components/SitesMap';
import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export function HomePage() {
  return (
    <Box sx={{ position: 'relative', height: '100vh', width: '100vw' }}>
      {/* Floating header with title and add button */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          right: 16,
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(8px)',
          borderRadius: 2,
          px: 3,
          py: 2,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}
      >
        <Typography variant='h4' component='h1' sx={{ color: 'primary.main' }}>
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
      </Box>
      
      {/* Full screen map */}
      <SitesMap />
    </Box>
  );
}
