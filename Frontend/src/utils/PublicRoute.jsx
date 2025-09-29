import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const PublicRoute = () => {
  const { auth } = useAuth();
  const userToken = localStorage.getItem('authToken');
  const tutorToken = localStorage.getItem('tutorAuthToken');

  if (auth?.accessToken || userToken) {
    return <Navigate to="/user/home" replace />;
  }

  if (tutorToken) {
    return <Navigate to="/tutor/home" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;