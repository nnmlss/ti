import { useState, useEffect } from 'react';
import { getGraphQLClient } from '@utils/graphqlClient';
import { CREATE_USER_ACCOUNTS } from '@utils/graphqlQueries';
import { FORM_DEFAULTS } from '@constants';
import type { CreateUserAccountsResponse, AccountCreationResult } from '@app-types';

export function useAdminCreateAccountsPage() {
  const [emails, setEmails] = useState<string[]>(FORM_DEFAULTS.EMPTY_STRING_ARRAY);
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
  useEffect(() => {
    if (!getToken()) {
      setError('не си с профил');
    }
  }, []);

  return {
    emails,
    loading,
    results,
    error,
    successMessage,
    addEmailField,
    removeEmailField,
    updateEmail,
    onSubmit: handleSubmit,
  };
}
