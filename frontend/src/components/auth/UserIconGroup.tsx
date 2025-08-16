import React from 'react';
import { Box, IconButton } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SyncIcon from '@mui/icons-material/Sync';
import type { UserIconGroupProps } from '@types';

export const UserIconGroup: React.FC<UserIconGroupProps> = ({
  user,
  onProfileClick,
  onLogout,
  onAddUser,
  onMigrateUrls,
}) => {

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      {/* Profile Icon */}
      <IconButton
        onClick={onProfileClick}
        sx={{
          color: 'inherit',
          '&:hover': {
            color: 'primary.main',
          },
          '&:active': {
            color: 'primary.main',
          },
        }}
      >
        <PersonIcon />
      </IconButton>

      {/* Super Admin Icons */}
      {user.isSuperAdmin && (
        <>
          <IconButton
            onClick={onAddUser}
            sx={{
              color: 'inherit',
              '&:hover': {
                color: 'primary.main',
              },
              '&:active': {
                color: 'primary.main',
              },
            }}
            title="Add Users"
          >
            <PersonAddIcon />
          </IconButton>
          
          <IconButton
            onClick={onMigrateUrls}
            sx={{
              color: 'inherit',
              '&:hover': {
                color: 'warning.main',
              },
              '&:active': {
                color: 'warning.main',
              },
            }}
            title="Migrate URLs"
          >
            <SyncIcon />
          </IconButton>
        </>
      )}

      {/* Logout Icon */}
      <IconButton
        onClick={onLogout}
        sx={{
          color: 'error.main',
          '&:hover': {
            color: 'error.dark',
          },
          '&:active': {
            color: 'error.dark',
          },
        }}
      >
        <LogoutIcon />
      </IconButton>
    </Box>
  );
};