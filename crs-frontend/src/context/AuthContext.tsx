import { createContext, useContext, useState, type ReactNode } from 'react';
import type { LoginResponse } from '../types/auth';

type Role = LoginResponse['role'];

interface AuthUser {
  id: number;
  username: string;
  role: Role;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (auth: LoginResponse) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const restoreUser = (): AuthUser | null => {
  const token = localStorage.getItem('crs_token');
  const storedUser = localStorage.getItem('crs_user');
  if (!token || !storedUser) return null;

  try {
    const user = JSON.parse(storedUser) as AuthUser;
    if (
      typeof user.id === 'number' &&
      typeof user.username === 'string' &&
      (user.role === 'ADMIN' || user.role === 'STUDENT')
    ) {
      return user;
    }
  } catch {
    // Invalid stored session is cleared below.
  }

  localStorage.removeItem('crs_token');
  localStorage.removeItem('crs_user');
  return null;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(restoreUser);

  const login = ({ userId, token, username, role }: LoginResponse) => {
    const authenticatedUser = { id: userId, username, role };
    localStorage.setItem('crs_token', token);
    localStorage.setItem('crs_user', JSON.stringify(authenticatedUser));
    setUser(authenticatedUser);
  };

  const logout = () => {
    localStorage.removeItem('crs_token');
    localStorage.removeItem('crs_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: user !== null }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// oxlint-disable-next-line react/only-export-components -- the hook belongs to this context.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
