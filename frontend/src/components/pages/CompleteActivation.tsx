import React from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Box,
  CircularProgress
} from '@mui/material';
import { useCompleteActivationPage } from '@hooks/pages/useCompleteActivationPage';

export const CompleteActivation: React.FC = () => {
  const {
    username,
    password,
    confirmPassword,
    loading,
    validating,
    message,
    error,
    tokenValid,
    setUsername,
    setPassword,
    setConfirmPassword,
    onSubmit,
    onRequestNewActivation,
  } = useCompleteActivationPage();


  if (validating) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>
            Validating activation token...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (!tokenValid) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" color="error">
            Invalid Token
          </Typography>
          
          <Alert severity="error" sx={{ mt: 2 }}>
            {error || 'The activation token is invalid or has expired.'}
          </Alert>

          <Box textAlign="center" sx={{ mt: 3 }}>
            <Button variant="contained" onClick={onRequestNewActivation}>
              Request New Activation Link
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Complete Activation
        </Typography>
        
        <Typography variant="body1" color="textSecondary" paragraph align="center">
          Create your username and password to complete account activation
        </Typography>

        <Box component="form" onSubmit={onSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
            required
            disabled={loading}
            inputProps={{ minLength: 3 }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            disabled={loading}
            inputProps={{ minLength: 6 }}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
            required
            disabled={loading}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Activate Account'}
          </Button>

          {message && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {message}
              <Typography variant="body2" sx={{ mt: 1 }}>
                Redirecting to login page...
              </Typography>
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