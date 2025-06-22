import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CrazyLoader from './CrazyLoader';
import React from 'react';


const ProtectedRoute = ({ isAdminRoute = false, children }) => {
  const { auth, loading } = useAuth();

  if (loading) {
    return <CrazyLoader />;
  }

  if (!auth.user) {
    return <Navigate to="/login" />;
  }

  if (isAdminRoute && auth.user.role !== 'admin') {
    return <Navigate to="/dashboard/user" />;
  }

  if (!isAdminRoute && auth.user.role === 'admin') {
    return <Navigate to="/admin/dashboard" />;
  }

  return children;
};

export default ProtectedRoute;
