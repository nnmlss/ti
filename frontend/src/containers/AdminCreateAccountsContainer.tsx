import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminCreateAccounts } from '@components/pages/AdminCreateAccounts';
import { useAdminCreateAccountsPage } from '@hooks/pages/useAdminCreateAccountsPage';

export function AdminCreateAccountsContainer() {
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(true);

  const handleBackClick = () => {
    setFadeIn(false);
    setTimeout(() => navigate('/'), 300);
  };

  const {
    emails,
    loading,
    results,
    error,
    successMessage,
    addEmailField,
    removeEmailField,
    updateEmail,
    onSubmit,
  } = useAdminCreateAccountsPage();

  return (
    <AdminCreateAccounts
      fadeIn={fadeIn}
      onBackClick={handleBackClick}
      emails={emails}
      loading={loading}
      results={results}
      error={error}
      successMessage={successMessage}
      addEmailField={addEmailField}
      removeEmailField={removeEmailField}
      updateEmail={updateEmail}
      onSubmit={onSubmit}
    />
  );
}