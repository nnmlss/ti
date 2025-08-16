import { useState, useEffect } from 'react';
import { useAuth } from '@hooks/auth/useAuth';
import { getGraphQLClient } from '@utils/graphqlClient';
import { LOGIN, UPDATE_PROFILE } from '@utils/graphqlQueries';
import { TIMEOUTS } from '@constants';
import type { LoginResponse, UpdateProfileResponse, UpdateProfileInput } from '@types';

export function useProfilePage() {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    email: user?.email || '',
    username: user?.username || '',
    password: '',
    repeatPassword: '',
    currentPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isCurrentPasswordValid, setIsCurrentPasswordValid] = useState(false);
  const [passwordCheckLoading, setPasswordCheckLoading] = useState(false);
  const [hasPasswordCheckCompleted, setHasPasswordCheckCompleted] = useState(false);
  const [hasPasswordsMatched, setHasPasswordsMatched] = useState(false);
  const [showRepeatPasswordError, setShowRepeatPasswordError] = useState(false);
  const [showPasswordLengthError, setShowPasswordLengthError] = useState(false);
  const [hasStartedTypingCurrentPassword, setHasStartedTypingCurrentPassword] = useState(false);

  const isPasswordValid = formData.password.length === 0 || formData.password.length >= 6;
  const doPasswordsMatch = formData.password === formData.repeatPassword;
  const isRepeatPasswordValid = doPasswordsMatch;

  const hasChanges = 
    formData.email !== user?.email || 
    formData.username !== user?.username || 
    formData.password.length > 0;

  const hasValidPasswordChange = 
    formData.password.length >= 6 && 
    formData.repeatPassword.length >= 6 && 
    doPasswordsMatch;

  const needsCurrentPassword = 
    formData.email !== user?.email || 
    formData.username !== user?.username || 
    hasValidPasswordChange;

  const isFormValid = 
    formData.email.includes('@') &&
    formData.username.length >= 3 &&
    isPasswordValid &&
    isRepeatPasswordValid &&
    (!needsCurrentPassword || isCurrentPasswordValid);

  // Password verification with delay
  useEffect(() => {
    if (!needsCurrentPassword || formData.currentPassword.length === 0) {
      setIsCurrentPasswordValid(false);
      setPasswordCheckLoading(false);
      setHasPasswordCheckCompleted(false);
      return;
    }

    // Mark that user has started typing
    setHasStartedTypingCurrentPassword(true);

    // Reset state immediately when password changes - user is typing
    setIsCurrentPasswordValid(false);
    setPasswordCheckLoading(false);
    setHasPasswordCheckCompleted(false);

    const timer = setTimeout(async () => {
      setPasswordCheckLoading(true);
      try {
        const client = getGraphQLClient(false);
        await client.request<LoginResponse>(LOGIN, {
          username: user?.username || '',
          password: formData.currentPassword,
        });
        setIsCurrentPasswordValid(true);
      } catch {
        setIsCurrentPasswordValid(false);
      } finally {
        setPasswordCheckLoading(false);
        setHasPasswordCheckCompleted(true);
      }
    }, TIMEOUTS.PASSWORD_VALIDATION_DELAY);

    return () => {
      clearTimeout(timer);
      setPasswordCheckLoading(false);
    };
  }, [formData.currentPassword, needsCurrentPassword, user?.username]);

  // Password matching validation with delay for repeat password
  useEffect(() => {
    if (formData.password.length < 6 || formData.repeatPassword.length === 0) {
      setShowRepeatPasswordError(false);
      return;
    }

    if (doPasswordsMatch) {
      setHasPasswordsMatched(true);
      setShowRepeatPasswordError(false);
      return;
    }

    // If passwords have matched before but now don't match, show error immediately on repeat field
    if (hasPasswordsMatched && !doPasswordsMatch) {
      setShowRepeatPasswordError(true);
      return;
    }

    // Show error 5 seconds after last change if passwords don't match
    const timer = setTimeout(() => {
      if (!doPasswordsMatch) {
        setShowRepeatPasswordError(true);
      }
    }, TIMEOUTS.PASSWORD_MATCH_DELAY);

    return () => clearTimeout(timer);
  }, [formData.password, formData.repeatPassword, doPasswordsMatch, hasPasswordsMatched]);

  // Password length validation with delay
  useEffect(() => {
    if (formData.password.length === 0 || formData.password.length >= 6) {
      setShowPasswordLengthError(false);
      return;
    }

    // Show error 3 seconds after last change if password is too short
    const timer = setTimeout(() => {
      if (formData.password.length > 0 && formData.password.length < 6) {
        setShowPasswordLengthError(true);
      }
    }, TIMEOUTS.PASSWORD_VALIDATION_DELAY);

    return () => clearTimeout(timer);
  }, [formData.password]);

  // Reset password match state when new password changes
  useEffect(() => {
    if (formData.password.length === 0) {
      setHasPasswordsMatched(false);
      setShowRepeatPasswordError(false);
      setShowPasswordLengthError(false);
    }
  }, [formData.password]);

  const resetField = (field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'email' ? user?.email || '' : user?.username || '',
    }));
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
    if (error || message) {
      setError('');
      setMessage('');
    }
    // Reset password validation when current password changes
    if (field === 'currentPassword') {
      setIsCurrentPasswordValid(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) return;

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const client = getGraphQLClient(true);
      
      const updateInput: UpdateProfileInput = {
        currentPassword: formData.currentPassword,
      };

      // Only include fields that have changed
      if (formData.email !== user?.email) {
        updateInput.email = formData.email;
      }
      if (formData.username !== user?.username) {
        updateInput.username = formData.username;
      }
      if (formData.password.length > 0) {
        updateInput.password = formData.password;
      }

      const response = await client.request<UpdateProfileResponse>(UPDATE_PROFILE, {
        input: updateInput,
      });

      // Update AuthContext with new user data
      const currentToken = localStorage.getItem('authToken');
      if (currentToken && response.updateProfile) {
        login(currentToken, response.updateProfile);
      }

      // Update form data with new values
      setFormData(prev => ({
        ...prev,
        email: response.updateProfile.email,
        username: response.updateProfile.username,
        password: '',
        repeatPassword: '',
        currentPassword: '',
      }));

      setMessage('Profile updated successfully');
      
      // Reset validation states
      setIsCurrentPasswordValid(false);
      setHasPasswordCheckCompleted(false);
      setHasStartedTypingCurrentPassword(false);
      setHasPasswordsMatched(false);
      setShowRepeatPasswordError(false);
      setShowPasswordLengthError(false);
    } catch (err: unknown) {
      console.error('Profile update error:', err);
      const errorMessage = 'Failed to update profile. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    formData,
    loading,
    message,
    error,
    isCurrentPasswordValid,
    passwordCheckLoading,
    hasPasswordCheckCompleted,
    hasPasswordsMatched,
    showRepeatPasswordError,
    showPasswordLengthError,
    hasStartedTypingCurrentPassword,
    isPasswordValid,
    doPasswordsMatch,
    isRepeatPasswordValid,
    hasChanges,
    hasValidPasswordChange,
    needsCurrentPassword,
    isFormValid,
    resetField,
    handleInputChange,
    onSubmit: handleSubmit,
  };
}