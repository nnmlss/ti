import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGraphQLClient } from '@utils/graphqlClient';
import { VALIDATE_TOKEN, ACTIVATE_ACCOUNT } from '@utils/graphqlQueries';
import type { ValidateTokenResponse, ActivateAccountResponse } from '@types';
import { useAuth } from '@hooks/auth/useAuth';

export function useCompleteActivationPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { login } = useAuth();
  
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
        const client = getGraphQLClient(false); // No CSRF needed for validation
        const data = await client.request<ValidateTokenResponse>(VALIDATE_TOKEN, {
          token,
        });

        if (data.validateToken.valid) {
          setTokenValid(true);
          // Note: GraphQL validateToken doesn't return email, but we can get it during activation
        } else {
          setError(data.validateToken.message || 'Invalid or expired token');
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
      const client = getGraphQLClient(false); // No CSRF needed for activation
      const data = await client.request<ActivateAccountResponse>(ACTIVATE_ACCOUNT, {
        token: token!,
        username: username.trim(),
        password,
      });

      if (data.activateAccount.token && data.activateAccount.user) {
        // Use AuthContext login method to store both token and user data
        login(data.activateAccount.token, data.activateAccount.user);
        
        // Immediate redirect and clear history to prevent password exposure
        window.location.replace('/');
      } else {
        setError(data.activateAccount.message || 'Activation failed');
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      setError('Failed to activate account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestNewActivation = () => {
    navigate('/activate');
  };

  return {
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
    onSubmit: handleSubmit,
    onRequestNewActivation: handleRequestNewActivation,
  };
}