import React from 'react';
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
  Fade,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { PageHeader } from '@components/common/PageHeader';
import type { ProfileProps } from '@app-types';

export function Profile({
  fadeIn,
  onBackClick,
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
}: ProfileProps) {

  if (!user) {
    return (
      <Container maxWidth='sm' sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant='h5' align='center' color='error'>
            Access Denied
          </Typography>
          <Typography variant='body1' align='center' color='textSecondary'>
            You must be logged in to view this page.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth='sm' sx={{ mt: 8 }}>
      <Fade in={fadeIn} timeout={300}>
        <Paper elevation={3} sx={{ p: 4 }}>
        <PageHeader title="Профил" onBackClick={onBackClick} />

        <Box component='form' onSubmit={onSubmit} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label='Email'
            type='email'
            value={formData.email}
            onChange={handleInputChange('email')}
            margin='normal'
            required
            disabled={loading}
            color={formData.email !== user?.email ? 'primary' : undefined}
            slotProps={{
              input: {
                endAdornment: formData.email !== user?.email && (
                  <InputAdornment position='end'>
                    <IconButton onClick={() => resetField('email')} size='small'>
                      <RefreshIcon sx={{ transform: 'scaleX(-1)' }} />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            fullWidth
            label='Username'
            value={formData.username}
            onChange={handleInputChange('username')}
            margin='normal'
            required
            disabled={loading}
            helperText='Minimum 3 characters'
            color={formData.username !== user?.username ? 'primary' : undefined}
            slotProps={{
              input: {
                endAdornment: formData.username !== user?.username && (
                  <InputAdornment position='end'>
                    <IconButton onClick={() => resetField('username')} size='small'>
                      <RefreshIcon sx={{ transform: 'scaleX(-1)' }} />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            fullWidth
            label='New Password'
            type='password'
            value={formData.password}
            onChange={handleInputChange('password')}
            margin='normal'
            disabled={loading}
            helperText='Leave empty to keep current password. Minimum 6 characters if changing.'
            error={showPasswordLengthError}
            color={doPasswordsMatch && formData.password.length >= 6 ? 'success' : 'primary'}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor:
                    doPasswordsMatch && formData.password.length >= 6
                      ? 'success.main'
                      : showPasswordLengthError
                      ? 'error.main'
                      : 'primary.main',
                },
                '& fieldset': {
                  borderColor:
                    doPasswordsMatch && formData.password.length >= 6
                      ? 'success.main'
                      : showPasswordLengthError
                      ? 'error.main'
                      : 'grey.300',
                },
              },
            }}
          />

          {formData.password.length >= 6 && (
            <TextField
              fullWidth
              label='Repeat New Password'
              type='password'
              value={formData.repeatPassword}
              onChange={handleInputChange('repeatPassword')}
              margin='normal'
              required
              disabled={loading}
              error={showRepeatPasswordError}
              color={doPasswordsMatch ? 'success' : 'primary'}
              helperText={showRepeatPasswordError ? "Passwords don't match" : ''}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: doPasswordsMatch
                      ? 'success.main'
                      : showRepeatPasswordError
                      ? 'error.main'
                      : 'primary.main',
                  },
                  '& fieldset': {
                    borderColor: doPasswordsMatch
                      ? 'success.main'
                      : showRepeatPasswordError
                      ? 'error.main'
                      : 'grey.300',
                  },
                },
              }}
            />
          )}

          {needsCurrentPassword && (
            <>
              <Typography
                variant='h6'
                sx={{
                  mt: 3,
                  mb: 1,
                  opacity: formData.currentPassword.length > 0 ? 0.3 : 1,
                  color:
                    formData.currentPassword.length === 0 && hasStartedTypingCurrentPassword
                      ? 'error.main'
                      : 'inherit',
                  transition: 'opacity 0.2s ease',
                }}
              >
                Enter your current password to confirm changes
              </Typography>

              <TextField
                fullWidth
                label='Current Password'
                type='password'
                value={formData.currentPassword}
                onChange={handleInputChange('currentPassword')}
                required
                disabled={loading}
                error={hasPasswordCheckCompleted && !isCurrentPasswordValid}
                color={isCurrentPasswordValid ? 'success' : 'primary'}
                helperText={
                  passwordCheckLoading
                    ? 'Checking password...'
                    : isCurrentPasswordValid
                    ? 'Password verified'
                    : hasPasswordCheckCompleted && !isCurrentPasswordValid
                    ? 'Incorrect password'
                    : 'Add password'
                }
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: isCurrentPasswordValid
                        ? 'success.main'
                        : hasPasswordCheckCompleted && !isCurrentPasswordValid
                        ? 'error.main'
                        : 'primary.main',
                    },
                    '& fieldset': {
                      borderColor: isCurrentPasswordValid
                        ? 'success.main'
                        : hasPasswordCheckCompleted && !isCurrentPasswordValid
                        ? 'error.main'
                        : 'grey.300',
                    },
                  },
                }}
              />

              <Button
                type='submit'
                fullWidth
                variant='contained'
                disabled={!isFormValid || loading}
                color={isFormValid ? 'success' : 'primary'}
                sx={{ mt: 3, mb: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Потвърждавам промените'}
              </Button>
            </>
          )}

          {message && (
            <Alert severity='success' sx={{ mt: 2 }}>
              {message}
            </Alert>
          )}

          {error && (
            <Alert severity='error' sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Box>
        </Paper>
      </Fade>
    </Container>
  );
};
