import { createContext } from 'react';
import type { AuthContextType } from '@app-types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
