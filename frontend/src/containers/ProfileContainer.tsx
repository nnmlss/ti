import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Profile } from '@components/pages/Profile';
import { useProfilePage } from '@hooks/pages/useProfilePage';

export function ProfileContainer() {
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(true);

  const handleBackClick = () => {
    setFadeIn(false);
    setTimeout(() => navigate('/'), 300);
  };

  const {
    user,
    formData,
    loading,
    message,
    error,
    isCurrentPasswordValid,
    passwordCheckLoading,
    hasPasswordCheckCompleted,
    showRepeatPasswordError,
    showPasswordLengthError,
    hasStartedTypingCurrentPassword,
    doPasswordsMatch,
    needsCurrentPassword,
    isFormValid,
    resetField,
    handleInputChange,
    onSubmit,
  } = useProfilePage();

  return (
    <Profile
      fadeIn={fadeIn}
      onBackClick={handleBackClick}
      user={user}
      formData={formData}
      loading={loading}
      message={message}
      error={error}
      isCurrentPasswordValid={isCurrentPasswordValid}
      passwordCheckLoading={passwordCheckLoading}
      hasPasswordCheckCompleted={hasPasswordCheckCompleted}
      showRepeatPasswordError={showRepeatPasswordError}
      showPasswordLengthError={showPasswordLengthError}
      hasStartedTypingCurrentPassword={hasStartedTypingCurrentPassword}
      doPasswordsMatch={doPasswordsMatch}
      needsCurrentPassword={needsCurrentPassword}
      isFormValid={isFormValid}
      resetField={resetField}
      handleInputChange={handleInputChange}
      onSubmit={onSubmit}
    />
  );
}