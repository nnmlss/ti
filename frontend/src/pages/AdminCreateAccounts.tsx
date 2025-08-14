import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Box,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';

interface CreateAccountsResponse {
  message: string;
  results: Array<{
    email: string;
    success: boolean;
    message: string;
    id?: number;
  }>;
}

export const AdminCreateAccounts: React.FC = () => {
  const [emails, setEmails] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CreateAccountsResponse['results']>([]);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const addEmailField = () => {
    setEmails([...emails, '']);
  };

  const removeEmailField = (index: number) => {
    if (emails.length > 1) {
      const newEmails = emails.filter((_, i) => i !== index);
      setEmails(newEmails);
    }
  };

  const updateEmail = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty emails and validate
    const validEmails = emails
      .map(email => email.trim())
      .filter(email => email.length > 0);
    
    if (validEmails.length === 0) {
      setError('At least one email is required');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = validEmails.filter(email => !emailRegex.test(email));
    
    if (invalidEmails.length > 0) {
      setError(`Invalid email format: ${invalidEmails.join(', ')}`);
      return;
    }

    setLoading(true);
    setError('');
    setResults([]);
    setSuccessMessage('');

    try {
      // Get token from localStorage (assuming user is logged in)
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setError('Authentication required. Please log in.');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/auth/admin/create-accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ emails: validEmails }),
      });

      const data: CreateAccountsResponse = await response.json();

      if (response.ok) {
        setResults(data.results);
        setSuccessMessage(data.message);
        
        // Reset form with successful emails removed
        const failedEmails = data.results
          .filter(result => !result.success)
          .map(result => result.email);
        
        setEmails(failedEmails.length > 0 ? failedEmails : ['']);
      } else {
        setError(data.message || 'Failed to create accounts');
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      setError('Failed to create accounts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getToken = (): string | null => {
    return localStorage.getItem('authToken');
  };

  // Check if user is authenticated
  React.useEffect(() => {
    if (!getToken()) {
      setError('You must be logged in as admin to access this page.');
    }
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Create User Accounts
        </Typography>
        
        <Typography variant="body1" color="textSecondary" paragraph align="center">
          Create new user accounts with email addresses. Users will need to use the activation page to set their credentials.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Email Addresses
          </Typography>

          {emails.map((email, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TextField
                fullWidth
                label={`Email ${index + 1}`}
                type="email"
                value={email}
                onChange={(e) => updateEmail(index, e.target.value)}
                disabled={loading}
              />
              
              {emails.length > 1 && (
                <IconButton
                  onClick={() => removeEmailField(index)}
                  disabled={loading}
                  color="error"
                  sx={{ ml: 1 }}
                >
                  <RemoveIcon />
                </IconButton>
              )}
            </Box>
          ))}

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button
              startIcon={<AddIcon />}
              onClick={addEmailField}
              disabled={loading}
              variant="outlined"
            >
              Add Email
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={loading || emails.every(email => !email.trim())}
              sx={{ ml: 'auto' }}
            >
              {loading ? <CircularProgress size={24} /> : 'Create Accounts'}
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {successMessage && (
            <Alert severity="info" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}

          {results.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Results
              </Typography>
              
              <List>
                {results.map((result, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={result.email}
                      secondary={result.message}
                    />
                    <ListItemSecondaryAction>
                      <Chip
                        label={result.success ? 'Success' : 'Failed'}
                        color={result.success ? 'success' : 'error'}
                        size="small"
                      />
                      {result.success && result.id && (
                        <Chip
                          label={`ID: ${result.id}`}
                          size="small"
                          variant="outlined"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};