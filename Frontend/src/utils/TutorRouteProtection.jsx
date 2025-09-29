import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const TutorProtectedRoute = () => {
  const token = localStorage.getItem('tutorAuthToken');
  // If tutor is not authenticated, redirect them to the login page
  return token ? <Outlet /> : <Navigate to="/tutor/login" replace />;
};

export const TutorPublicRoute = () => {
  const token = localStorage.getItem('tutorAuthToken');
  // If tutor is authenticated, redirect them away from login/register to the home page
  return token ? <Navigate to="/tutor/home" replace /> : <Outlet />;
};