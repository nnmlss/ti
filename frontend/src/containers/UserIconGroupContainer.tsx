import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/auth/useAuth';
import { UserIconGroup } from '@components/auth/UserIconGroup';
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

export const UserIconGroupContainer: React.FC = () => {
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

    // Reset previous state and open dialog
    setMigrationResult(null);
    setMigrationError(null);
    setDialogOpen(true);
    setIsMigrating(true);

    try {
      const client = getGraphQLClient(true); // Authenticated request
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
      <UserIconGroup
        user={user}
        onProfileClick={handleProfileClick}
        onLogout={handleLogout}
        onAddUser={handleAddUser}
        onMigrateUrls={handleMigrateUrls}
      />

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
