import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useAuth } from '@contexts/AuthContext';
import { getGraphQLClient } from '@utils/graphqlClient';
import { LOGIN, UPDATE_PROFILE } from '@utils/graphqlQueries';
import type { LoginResponse, UpdateProfileResponse, UpdateProfileInput } from '@types';

export const Profile: React.FC = () => {
  const { user } = useAuth();
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
    }, 3000);

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
    }, 5000);

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
    }, 3000);

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

      setMessage('Profile updated successfully');
      setFormData(prev => ({ ...prev, password: '', repeatPassword: '', currentPassword: '' }));
      
      // Reset validation states
      setIsCurrentPasswordValid(false);
      setHasPasswordCheckCompleted(false);
      setHasStartedTypingCurrentPassword(false);
      setHasPasswordsMatched(false);
      setShowRepeatPasswordError(false);
      setShowPasswordLengthError(false);
      
      console.log('Profile updated:', response.updateProfile);
    } catch (err: any) {
      console.error('Profile update error:', err);
      setError(err?.response?.errors?.[0]?.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" align="center" color="error">
            Access Denied
          </Typography>
          <Typography variant="body1" align="center" color="textSecondary">
            You must be logged in to view this page.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Профил
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleInputChange('email')}
            margin="normal"
            required
            disabled={loading}
            color={formData.email !== user?.email ? "primary" : "inherit"}
            InputProps={{
              endAdornment: formData.email !== user?.email && (
                <InputAdornment position="end">
                  <IconButton onClick={() => resetField('email')} size="small">
                    <RefreshIcon sx={{ transform: 'scaleX(-1)' }} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Username"
            value={formData.username}
            onChange={handleInputChange('username')}
            margin="normal"
            required
            disabled={loading}
            helperText="Minimum 3 characters"
            color={formData.username !== user?.username ? "primary" : "inherit"}
            InputProps={{
              endAdornment: formData.username !== user?.username && (
                <InputAdornment position="end">
                  <IconButton onClick={() => resetField('username')} size="small">
                    <RefreshIcon sx={{ transform: 'scaleX(-1)' }} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={formData.password}
            onChange={handleInputChange('password')}
            margin="normal"
            disabled={loading}
            helperText="Leave empty to keep current password. Minimum 6 characters if changing."
            error={showPasswordLengthError}
            color={doPasswordsMatch && formData.password.length >= 6 ? "success" : "primary"}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: doPasswordsMatch && formData.password.length >= 6 ? 'success.main' : 
                               showPasswordLengthError ? 'error.main' : 
                               'primary.main'
                },
                '& fieldset': {
                  borderColor: doPasswordsMatch && formData.password.length >= 6 ? 'success.main' : 
                               showPasswordLengthError ? 'error.main' : 
                               'grey.300'
                }
              }
            }}
          />

          {formData.password.length >= 6 && (
            <TextField
              fullWidth
              label="Repeat New Password"
              type="password"
              value={formData.repeatPassword}
              onChange={handleInputChange('repeatPassword')}
              margin="normal"
              required
              disabled={loading}
              error={showRepeatPasswordError}
              color={doPasswordsMatch ? "success" : "primary"}
              helperText={showRepeatPasswordError ? "Passwords don't match" : ""}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: doPasswordsMatch ? 'success.main' : 
                                 showRepeatPasswordError ? 'error.main' : 
                                 'primary.main'
                  },
                  '& fieldset': {
                    borderColor: doPasswordsMatch ? 'success.main' : 
                                 showRepeatPasswordError ? 'error.main' : 
                                 'grey.300'
                  }
                }
              }}
            />
          )}

          {needsCurrentPassword && (
            <>
              <Typography 
                variant="h6" 
                sx={{ 
                  mt: 3, 
                  mb: 1,
                  opacity: formData.currentPassword.length > 0 ? 0.3 : 1,
                  color: formData.currentPassword.length === 0 && hasStartedTypingCurrentPassword ? 'error.main' : 'inherit',
                  transition: 'opacity 0.2s ease'
                }}
              >
                Enter your current password to confirm changes
              </Typography>
              
              <TextField
                fullWidth
                label="Current Password"
                type="password"
                value={formData.currentPassword}
                onChange={handleInputChange('currentPassword')}
                required
                disabled={loading}
                error={hasPasswordCheckCompleted && !isCurrentPasswordValid}
                color={isCurrentPasswordValid ? "success" : "primary"}
                helperText={
                  passwordCheckLoading ? 'Checking password...' :
                  isCurrentPasswordValid ? 'Password verified' :
                  hasPasswordCheckCompleted && !isCurrentPasswordValid ? 'Incorrect password' :
                  'Add password'
                }
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: isCurrentPasswordValid ? 'success.main' : 
                                   (hasPasswordCheckCompleted && !isCurrentPasswordValid) ? 'error.main' : 
                                   'primary.main'
                    },
                    '& fieldset': {
                      borderColor: isCurrentPasswordValid ? 'success.main' : 
                                   (hasPasswordCheckCompleted && !isCurrentPasswordValid) ? 'error.main' : 
                                   'grey.300'
                    }
                  }
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={!isFormValid || loading}
                color={isFormValid ? "success" : "primary"}
                sx={{ mt: 3, mb: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Потвърждавам промените'}
              </Button>
            </>
          )}

          {message && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {message}
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Box>
      </Paper>
    </Container>
  );
};