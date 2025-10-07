import { Navigate, Route, Routes } from 'react-router-dom';
import { useMemo } from 'react';
import { AppLayout } from '@components/layout/AppLayout';
import { AdminConsolePage } from '@pages/AdminConsolePage';
import { UserDashboardPage } from '@pages/UserDashboardPage';
import { LoginPage } from '@pages/LoginPage';
import { ProtectedRoute } from '@components/routing/ProtectedRoute';
import { useAuthStore, selectIsAuthenticated } from '@store/authStore';

const App = () => {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const role = useAuthStore((state) => state.user?.role);

  const defaultPath = useMemo(() => {
    if (!isAuthenticated) {
      return '/login';
    }
    return role === 'admin' ? '/admin' : '/user';
  }, [isAuthenticated, role]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to={defaultPath} replace />} />
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/user" element={<UserDashboardPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminConsolePage />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to={defaultPath} replace />} />
    </Routes>
  );
};

export default App;
