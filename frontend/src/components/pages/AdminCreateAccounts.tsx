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
  Fade,
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { PageHeader } from '@components/common/PageHeader';
import type { AdminCreateAccountsProps } from '@app-types';

export function AdminCreateAccounts({
  fadeIn,
  onBackClick,
  emails,
  loading,
  results,
  error,
  successMessage,
  addEmailField,
  removeEmailField,
  updateEmail,
  onSubmit,
}: AdminCreateAccountsProps) {

  return (
    <Container maxWidth='md' sx={{ mt: 4 }}>
      <Fade in={fadeIn} timeout={300}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <PageHeader title="Още профили" onBackClick={onBackClick} />

        <Typography variant='body1' color='textSecondary' align='center' sx={{ mb: 2 }}>
          Потребителите трябва да използват страницата за активация от мейла, за да зададат
          потребител и парола.
          <br />
          Users will need to use the activation page to set their credentials.
        </Typography>

        <Box component='form' onSubmit={onSubmit} sx={{ mt: 3 }}>
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

          {results && results.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant='h6' gutterBottom>
                Results
              </Typography>

              <List>
                {results!.map((result, index) => (
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
      </Fade>
    </Container>
  );
};
