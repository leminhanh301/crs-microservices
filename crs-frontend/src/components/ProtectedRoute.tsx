import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { LoginResponse } from '../types/auth';

interface ProtectedRouteProps {
  allowedRole: LoginResponse['role'];
}

export const ProtectedRoute = ({ allowedRole }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== allowedRole) {
    return <Navigate to="/courses" replace />;
  }

  return <Outlet />;
};
