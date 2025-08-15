import React, { useState } from 'react';
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
import { useActivationRequest } from '@hooks/useActivationRequest';
import { useConstants } from '@hooks/useConstants';

export const ActivationRequest: React.FC = () => {
  const [email, setEmail] = useState('');
  const { loading, message, error, submitActivationRequest, clearMessages } = useActivationRequest();
  const { expiryMinutes } = useConstants();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitActivationRequest(email);
    // Clear form after successful submission (checked inside hook)
    if (message && !error) {
      setEmail('');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Account Activation
        </Typography>
        
        <Typography variant="body1" color="textSecondary" paragraph align="center">
          Enter your email address to receive an activation link if your account has been created.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error || message) clearMessages();
            }}
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
            {loading ? <CircularProgress size={24} /> : 'Send Activation Link'}
          </Button>

          {message && (
            <Alert severity="info" sx={{ mt: 2 }}>
              {message}
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Box>

        <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 3 }}>
          If your email is registered, you will receive an activation link valid for {expiryMinutes || '7'} minutes.
          <br />
          Ако вашият имейл е регистриран, ще получите линк за активация валиден за {expiryMinutes || '7'} минути.
        </Typography>
      </Paper>
    </Container>
  );
};