import { ActivationRequest } from '@components/pages/ActivationRequest';
import { useActivationRequestPage } from '@hooks/pages/useActivationRequestPage';

export function ActivationRequestContainer() {
  const {
    email,
    loading,
    message,
    error,
    expiryMinutes,
    onSubmit,
    onEmailChange,
  } = useActivationRequestPage();

  return (
    <ActivationRequest
      email={email}
      loading={loading}
      message={message}
      error={error}
      expiryMinutes={expiryMinutes ?? 7}
      onSubmit={onSubmit}
      onEmailChange={onEmailChange}
    />
  );
}