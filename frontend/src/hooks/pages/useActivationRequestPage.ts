import { useState } from 'react';
import { useActivationRequest } from '@hooks/business/useActivationRequest';
import { useConstants } from '@hooks/utils/useConstants';

export function useActivationRequestPage() {
  const [email, setEmail] = useState('');
  const { loading, message, error, submitActivationRequest, clearMessages } =
    useActivationRequest();
  const { expiryMinutes } = useConstants();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitActivationRequest(email);
    // Clear form after successful submission (checked inside hook)
    if (message && !error) {
      setEmail('');
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error || message) clearMessages();
  };

  return {
    email,
    loading,
    message,
    error,
    expiryMinutes,
    onSubmit: handleSubmit,
    onEmailChange: handleEmailChange,
  };
}
