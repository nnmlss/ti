import React from 'react';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PublicIcon from '@mui/icons-material/Public';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AirIcon from '@mui/icons-material/Air';
import { UserIconGroup } from '@components/auth/UserIconGroup';
import type { BottomNavigationBarProps } from '@app-types';

export const BottomNavigationBar: React.FC<BottomNavigationBarProps> = ({
  isAuthenticated,
  isHomePage,
  isListView,
  filter,
  onViewToggle,
  onWindFilterOpen,
}) => {
  return (
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
      {/* Left section */}
      {isAuthenticated ? (
        <UserIconGroup />
      ) : (
        <Typography
          variant='h5'
          component='h1'
          sx={{
            color: 'primary.main',
            fontSize: '1rem',
            display: { xs: 'none', sm: 'block' },
          }}
        >
          Места за летене
        </Typography>
      )}

      {/* Center section - Always show map/list, wind filter only on home */}
      <Box>
        {isHomePage && (
          <Button
            onClick={onWindFilterOpen}
            variant={filter?.windDirection ? 'contained' : 'text'}
            sx={{
              color: filter?.windDirection ? '#fff' : 'inherit',
              minWidth: '46px',
              width: '46px',
              height: '28px',
              fontSize: filter?.windDirection ? '0.875rem' : 'inherit',
              fontWeight: filter?.windDirection ? 'normal' : 'normal',
            }}
          >
            {filter?.windDirection || <AirIcon />}
          </Button>
        )}
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

      {/* Right section */}
      {isAuthenticated ? (
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
      ) : (
        <Typography
          variant='h5'
          component='h1'
          sx={{
            color: 'primary.main',
            fontSize: '1rem',
            display: { xs: 'none', sm: 'block' },
          }}
        >
          copyright
          <Button component={Link} variant='text' to='https://borislav.space'>
            borislav.space
          </Button>
        </Typography>
      )}
    </Box>
  );
};
