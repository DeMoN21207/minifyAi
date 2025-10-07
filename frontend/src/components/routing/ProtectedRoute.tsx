import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuthStore, selectIsAuthenticated } from '@store/authStore';
import type { UserRole } from '@types/index';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole;
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const location = useLocation();
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    const fallback = user?.role === 'admin' ? '/admin' : '/user';
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
};
