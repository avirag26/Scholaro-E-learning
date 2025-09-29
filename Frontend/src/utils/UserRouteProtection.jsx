import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

export const UserProtectedRoute = () => {
  const { auth } = useAuth();
  const token = localStorage.getItem('authToken');
  // If user is not authenticated, redirect them to the login page
  return auth?.accessToken || token ? <Outlet /> : <Navigate to="/user/login" replace />;
};

export const UserPublicRoute = () => {
  const { auth } = useAuth();
  const token = localStorage.getItem('authToken');
  // If user is authenticated, redirect them away from login/register to the home page
  return auth?.accessToken || token ? <Navigate to="/user/home" replace /> : <Outlet />;
};