import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const PrivateRoute = () => {
  const { auth } = useAuth();
  const location = useLocation();

  // If there's an accessToken, the user is considered logged in
  return auth?.accessToken ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default PrivateRoute;
