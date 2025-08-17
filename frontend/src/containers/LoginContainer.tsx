import { Login } from '@components/pages/Login';
import { useLoginPage } from '@hooks/pages/useLoginPage';

export function LoginContainer() {
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
    <Login
      username={username}
      password={password}
      loading={loading}
      error={error}
      setUsername={setUsername}
      setPassword={setPassword}
      onSubmit={onSubmit}
      onActivationClick={onActivationClick}
    />
  );
}