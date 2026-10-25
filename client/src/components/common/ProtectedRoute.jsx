import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function ProtectedRoute({ requiredRole }) {
  const { currentUser, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Unregistered visitors must register/sign in first to write or access dashboard
    const targetPath = location.pathname + location.search;
    const redirectUrl = `/signup?redirect=${encodeURIComponent(targetPath)}&notice=register_required`;

    return <Navigate to={redirectUrl} state={{ from: location }} replace />;
  }

  // If a specific role like 'admin' is required
  if (requiredRole && requiredRole === 'admin' && currentUser?.role?.toLowerCase() !== 'admin') {
    return <Navigate to="/login?notice=admin_required" replace />;
  }

  return <Outlet />;
}
