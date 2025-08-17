import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, IconButton } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SyncIcon from '@mui/icons-material/Sync';
import { useAuth } from '@hooks/auth/useAuth';
import { MigrationResultDialog } from '@components/dialogs/MigrationResultDialog';
import { getGraphQLClient } from '@utils/graphqlClient';
import { gql } from 'graphql-request';
import type { MigrationResult } from '@app-types';

const MIGRATE_URLS_MUTATION = gql`
  mutation MigrateUrls {
    migrateAddUrls {
      success
      message
      sitesUpdated
      errors
    }
  }
`;

export const UserIconGroup: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMigrating, setIsMigrating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [migrationResult, setMigrationResult] = useState<MigrationResult | null>(null);
  const [migrationError, setMigrationError] = useState<string | null>(null);

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

  const handleMigrateUrls = async () => {
    if (!user?.isSuperAdmin || isMigrating) return;

    setMigrationResult(null);
    setMigrationError(null);
    setDialogOpen(true);
    setIsMigrating(true);

    try {
      const client = getGraphQLClient(true);
      const result = await client.request<{ migrateAddUrls: MigrationResult }>(
        MIGRATE_URLS_MUTATION
      );
      setMigrationResult(result.migrateAddUrls);

      if (result.migrateAddUrls.errors.length > 0) {
        console.error('Migration errors:', result.migrateAddUrls.errors);
      }
    } catch (error) {
      console.error('Migration failed:', error);
      setMigrationError(String(error));
    } finally {
      setIsMigrating(false);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setMigrationResult(null);
    setMigrationError(null);
  };

  if (!user) return null;
  return (
    <>
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

      {/* Super Admin Icons */}
      {user.isSuperAdmin && (
        <>
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
            title='Add Users'
          >
            <PersonAddIcon />
          </IconButton>

          <IconButton
            onClick={handleMigrateUrls}
            sx={{
              color: 'inherit',
              '&:hover': {
                color: 'warning.main',
              },
              '&:active': {
                color: 'warning.main',
              },
            }}
            title='Migrate URLs'
          >
            <SyncIcon />
          </IconButton>
        </>
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

      <MigrationResultDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        isLoading={isMigrating}
        result={migrationResult}
        error={migrationError}
      />
    </>
  );
};
