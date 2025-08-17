import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGraphQLClient } from '@utils/graphqlClient';
import { LOGIN } from '@utils/graphqlQueries';
import type { LoginResponse } from '@app-types';
import { useAuth } from '@hooks/auth/useAuth';

export function useLoginPage() {
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

  const handleActivationClick = () => {
    navigate('/activate');
  };

  return {
    username,
    password,
    loading,
    error,
    setUsername,
    setPassword,
    onSubmit: handleSubmit,
    onActivationClick: handleActivationClick,
  };
}
