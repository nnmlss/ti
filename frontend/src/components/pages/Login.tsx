import React from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Box,
  CircularProgress,
} from '@mui/material';
import { useLoginPage } from '@hooks/pages/useLoginPage';

export const Login: React.FC = () => {
  const {
    username,
    password,
    loading,
    error,
    setUsername,
    setPassword,
    onSubmit,
    onActivationClick,
  } = useLoginPage();

  return (
    <Container maxWidth='sm' sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant='h4' component='h1' gutterBottom align='center'>
          Login
        </Typography>

        <Box component='form' onSubmit={onSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label='Username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin='normal'
            required
            disabled={loading}
          />

          <TextField
            fullWidth
            label='Password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin='normal'
            required
            disabled={loading}
          />

          <Button
            type='submit'
            fullWidth
            variant='contained'
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Login'}
          </Button>

          {error && (
            <Alert severity='error' sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Box>

        <Box textAlign='center' sx={{ mt: 3 }}>
          <Button variant='text' onClick={onActivationClick}>
            Need account activation?
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};
