import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, organizerOnly = false }) => {
  const { user, loading, isOrganizer } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (organizerOnly && !isOrganizer) {
    return <Navigate to="/inicio" replace />;
  }

  return children;
};

export default ProtectedRoute;
