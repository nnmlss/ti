import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { getGraphQLClient } from '@utils/graphqlClient';
import { LOGIN } from '@utils/graphqlQueries';
import type { LoginResponse } from '@types';
import { useAuth } from '@contexts/AuthContext';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password) {
      setError('Username and password are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const client = getGraphQLClient(false); // No CSRF needed for login
      const data = await client.request<LoginResponse>(LOGIN, {
        username: username.trim(),
        password,
      });

      if (data.login.token) {
        // Update AuthContext state
        login(data.login.token, data.login.user);

        // Immediate redirect and clear history to prevent password exposure
        window.location.replace('/');
      } else {
        setError(data.login.message || 'Login failed');
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth='sm' sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant='h4' component='h1' gutterBottom align='center'>
          Login
        </Typography>

        <Box component='form' onSubmit={handleSubmit} sx={{ mt: 2 }}>
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
          <Button variant='text' onClick={() => navigate('/activate')}>
            Need account activation?
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};
