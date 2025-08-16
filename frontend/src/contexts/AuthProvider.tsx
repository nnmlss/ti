import React, { useState, useEffect } from 'react';
import type { AuthUser, AuthContextType, AuthProviderProps } from '@types';
import { AuthContext } from './AuthContext';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth token on app load
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('authUser');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData) as AuthUser;
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = (token: string, userData: AuthUser) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('authUser', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};