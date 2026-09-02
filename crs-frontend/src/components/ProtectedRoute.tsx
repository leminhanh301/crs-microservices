// path: crs-frontend/src/components/ProtectedRoute.tsx
// purpose: chan truy cap route neu chua dang nhap hoac khong dung role yeu cau

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  requiredRole?: 'ADMIN' | 'STUDENT';
  allowedRole?: 'ADMIN' | 'STUDENT';
}

export default function ProtectedRoute({ children, requiredRole, allowedRole }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();
  const targetRole = requiredRole || allowedRole;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (targetRole && user?.role !== targetRole) {
    return <Navigate to="/courses" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}

export { ProtectedRoute };
