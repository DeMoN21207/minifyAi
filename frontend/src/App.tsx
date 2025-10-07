import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@components/layout/AppLayout';
import { AdminConsolePage } from '@pages/AdminConsolePage';
import { UserDashboardPage } from '@pages/UserDashboardPage';

const App = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/user" replace />} />
        <Route path="/user" element={<UserDashboardPage />} />
        <Route path="/admin" element={<AdminConsolePage />} />
      </Route>
    </Routes>
  );
};

export default App;
