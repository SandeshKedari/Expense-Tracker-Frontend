import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Spin } from 'antd';
import { useAppSelector } from '../app/hooks';

export function ProtectedRoute() {
  const { user, status } = useAppSelector((state) => state.auth);
  const location = useLocation();
  if (status === 'idle' || status === 'loading') {
    return <div className="page-loading"><Spin size="large" /></div>;
  }
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}
