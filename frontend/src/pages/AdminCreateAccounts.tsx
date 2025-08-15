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
  Chip,
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { getGraphQLClient } from '@utils/graphqlClient';
import { CREATE_USER_ACCOUNTS } from '@utils/graphqlQueries';
import type { CreateUserAccountsResponse, AccountCreationResult } from '@types';

export const AdminCreateAccounts: React.FC = () => {
  const [emails, setEmails] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AccountCreationResult[]>([]);
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
    const validEmails = emails.map((email) => email.trim()).filter((email) => email.length > 0);

    if (validEmails.length === 0) {
      setError('At least one email is required');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = validEmails.filter((email) => !emailRegex.test(email));

    if (invalidEmails.length > 0) {
      setError(`Invalid email format: ${invalidEmails.join(', ')}`);
      return;
    }

    setLoading(true);
    setError('');
    setResults([]);
    setSuccessMessage('');

    try {
      const client = getGraphQLClient(true); // Requires CSRF and auth
      const data = await client.request<CreateUserAccountsResponse>(CREATE_USER_ACCOUNTS, {
        emails: validEmails,
      });

      setResults(data.createUserAccounts);
      setSuccessMessage('Account creation process completed');

      // Reset form with successful emails removed
      const failedEmails = data.createUserAccounts
        .filter((result) => !result.success)
        .map((result) => result.email);

      setEmails(failedEmails.length > 0 ? failedEmails : ['']);
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
      setError('не си с профил');
    }
  }, []);

  return (
    <Container maxWidth='md' sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant='h4' component='h1' gutterBottom align='center'>
          Още профили
        </Typography>

        <Typography variant='body1' color='textSecondary' align='center' sx={{ mb: 2 }}>
          Потребителите трябва да използват страницата за активация от мейла, за да зададат
          потребител и парола.
          <br />
          Users will need to use the activation page to set their credentials.
        </Typography>

        <Box component='form' onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Typography variant='h6' gutterBottom>
            Email Addresses
          </Typography>

          {emails.map((email, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TextField
                fullWidth
                label={`Email ${index + 1}`}
                type='email'
                value={email}
                onChange={(e) => updateEmail(index, e.target.value)}
                disabled={loading}
              />

              {emails.length > 1 && (
                <IconButton
                  onClick={() => removeEmailField(index)}
                  disabled={loading}
                  color='error'
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
              variant='outlined'
            >
              Add Email
            </Button>

            <Button
              type='submit'
              variant='contained'
              disabled={loading || emails.every((email) => !email.trim())}
              sx={{ ml: 'auto' }}
            >
              {loading ? <CircularProgress size={24} /> : 'Create Accounts'}
            </Button>
          </Box>

          {error && (
            <Alert severity='error' sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {successMessage && (
            <Alert severity='info' sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}

          {results.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant='h6' gutterBottom>
                Results
              </Typography>

              <List>
                {results.map((result, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip
                          label={result.success ? 'Success' : 'Failed'}
                          color={result.success ? 'success' : 'error'}
                          size='small'
                        />
                        {result.success && result.id && (
                          <Chip label={`ID: ${result.id}`} size='small' variant='outlined' />
                        )}
                      </Box>
                    }
                  >
                    <ListItemText primary={result.email} secondary={result.message} />
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
