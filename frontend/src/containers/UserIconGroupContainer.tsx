import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@hooks/auth/useAuth";
import { UserIconGroup } from '@components/auth/UserIconGroup';

export const UserIconGroupContainer: React.FC = () => {
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
    <UserIconGroup
      user={user}
      onProfileClick={handleProfileClick}
      onLogout={handleLogout}
      onAddUser={handleAddUser}
    />
  );
};