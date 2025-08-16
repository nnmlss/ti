import React from 'react';
import { Box, IconButton } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import type { UserIconGroupProps } from '@types';

export const UserIconGroup: React.FC<UserIconGroupProps> = ({
  user,
  onProfileClick,
  onLogout,
  onAddUser,
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

      {/* Add User Icon (Super Admin only) */}
      {user.isSuperAdmin && (
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
        >
          <PersonAddIcon />
        </IconButton>
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