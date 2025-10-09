import { Navigate, Outlet } from 'react-router-dom';

export const UserProtectedRoute = () => {
  const token = localStorage.getItem('authToken');
  // If user is not authenticated, redirect them to the login page
  return token ? <Outlet /> : <Navigate to="/user/login" replace />;
};

export const UserPublicRoute = () => {
  const token = localStorage.getItem('authToken');
  // If user is authenticated, redirect them away from login/register to the home page
  return token ? <Navigate to="/user/home" replace /> : <Outlet />;
};

export default UserProtectedRoute;