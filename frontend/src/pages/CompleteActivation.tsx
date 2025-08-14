import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

interface ValidationResponse {
  message: string;
  email?: string;
}

interface ActivationResponse {
  message: string;
}

export const CompleteActivation: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [tokenValid, setTokenValid] = useState(false);

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError('No activation token provided');
        setValidating(false);
        return;
      }

      try {
        const response = await fetch(`/api/auth/validate/${token}`);
        const data: ValidationResponse = await response.json();

        if (response.ok) {
          setTokenValid(true);
          setEmail(data.email || '');
        } else {
          setError(data.message || 'Invalid or expired token');
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_err) {
        setError('Failed to validate token');
      } finally {
        setValidating(false);
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    
    if (username.length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }
    
    if (!password) {
      setError('Password is required');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`/api/auth/activate/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data: ActivationResponse = await response.json();

      if (response.ok) {
        setMessage(data.message);
        
        // Redirect to login page after success
        setTimeout(() => {
          navigate('/adm1n');
        }, 2000);
      } else {
        setError(data.message || 'Activation failed');
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      setError('Failed to activate account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
            <Button variant="contained" onClick={() => navigate('/activate')}>
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
          Create your username and password for: <strong>{email}</strong>
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
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