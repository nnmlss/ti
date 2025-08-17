import { CompleteActivation } from '@components/pages/CompleteActivation';
import { useCompleteActivationPage } from '@hooks/pages/useCompleteActivationPage';

export function CompleteActivationContainer() {
  const {
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
    onSubmit,
    onRequestNewActivation,
  } = useCompleteActivationPage();

  return (
    <CompleteActivation
      username={username}
      password={password}
      confirmPassword={confirmPassword}
      loading={loading}
      validating={validating}
      message={message}
      error={error}
      tokenValid={tokenValid}
      setUsername={setUsername}
      setPassword={setPassword}
      setConfirmPassword={setConfirmPassword}
      onSubmit={onSubmit}
      onRequestNewActivation={onRequestNewActivation}
    />
  );
}