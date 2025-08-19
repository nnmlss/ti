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
  showWindFilter,
  onViewToggle,
  onWindFilterToggle,
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
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: { xs: 'center', sm: 'space-between' },
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

      {/* Center and Right sections - grouped on xs, separate on sm+ */}
      <Box
        sx={{
          display: { xs: 'flex', sm: 'contents' },
          justifyContent: 'space-evenly',
          width: { xs: '100%', sm: 'auto' },
        }}
      >
        {/* Center section - Labels toggle, wind filter only on home, map/list view */}
        <Box>
          {isHomePage && (
            <Button
              onClick={showWindFilter ? undefined : onWindFilterToggle}
              variant={filter?.windDirection ? 'contained' : 'text'}
              sx={{
                color: showWindFilter
                  ? 'primary.main'
                  : filter?.windDirection
                  ? '#fff'
                  : 'inherit',
                minWidth: '32px',
                width: '32px',
                height: '23px',
                fontSize: filter?.windDirection ? '0.6rem' : 'inherit',
                fontWeight: filter?.windDirection ? 'normal' : 'normal',
                // mr: filter?.windDirection ? 2 : 1,
              }}
            >
              {filter?.windDirection || <AirIcon />}
            </Button>
          )}
          <>
            <IconButton
              onClick={() => onViewToggle('map')}
              sx={{ color: !isListView ? 'primary.main' : 'inherit' }}
            >
              <PublicIcon />
            </IconButton>
          </>

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
              sx={{
                '& .MuiButton-startIcon': {
                  mr: { xs: 0, sm: 1 },
                },
              }}
            >
              <Box component='span' sx={{ display: { xs: 'none', sm: 'inline' } }}>
                добави старт
              </Box>
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
    </Box>
  );
};
