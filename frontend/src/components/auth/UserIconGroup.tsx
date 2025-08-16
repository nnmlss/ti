import React from 'react';
import { Box, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useAuth } from '@contexts/AuthContext';

export const UserIconGroup: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleProfileClick = () => {
    navigate('/edit-profile');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAddUser = () => {
    navigate('/admin/add-account');
  };

  if (!user) return null;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      {/* Profile Icon */}
      <IconButton
        onClick={handleProfileClick}
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
          onClick={handleAddUser}
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
        onClick={handleLogout}
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