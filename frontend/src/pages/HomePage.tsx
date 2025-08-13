import { SitesMap } from '../components/main/SitesMap';
import { SitesList } from '../components/main/SitesList';
import { WindDirectionFilter } from '../components/main/WindDirectionFilter';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PublicIcon from '@mui/icons-material/Public';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AirIcon from '@mui/icons-material/Air';

interface HomePageProps {
  homeView: 'map' | 'list';
  filter: { windDirection: string | null };
  showWindFilter: boolean;
  onViewToggle: (view: 'map' | 'list') => void;
  onWindFilterToggle: () => void;
  onWindFilterClose: () => void;
}

export function HomePage({
  homeView,
  filter,
  showWindFilter,
  onViewToggle,
  onWindFilterToggle,
  onWindFilterClose,
}: HomePageProps) {
  const isListView = homeView === 'list';

  return (
    <Box sx={{ position: 'relative', height: '100vh', width: '100vw', overflowX: 'hidden' }}>
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
        <Typography
          variant='h5'
          component='h1'
          sx={{ color: 'primary.main', fontSize: '1rem', display: { xs: 'none', sm: 'block' } }}
        >
          Места за летене
        </Typography>
        <Box>
          <Button
            onClick={onWindFilterToggle}
            variant={filter.windDirection ? 'contained' : 'text'}
            sx={{
              color: filter.windDirection ? '#fff' : 'inherit',
              minWidth: '46px',
              width: '46px',
              height: '28px',
              fontSize: filter.windDirection ? '0.875rem' : 'inherit',
              fontWeight: filter.windDirection ? 'normal' : 'normal',
            }}
          >
            {filter.windDirection || <AirIcon />}
          </Button>
          <IconButton
            onClick={() => onViewToggle('map')}
            sx={{ color: !isListView ? 'primary.main' : 'inherit' }}
          >
            <PublicIcon />
          </IconButton>
          <IconButton
            onClick={() => onViewToggle('list')}
            sx={{ color: isListView ? 'primary.main' : 'inherit' }}
          >
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
      {showWindFilter && <WindDirectionFilter onClose={onWindFilterClose} />}

      {/* Conditional content */}
      {isListView ? <SitesList /> : <SitesMap />}
    </Box>
  );
}
