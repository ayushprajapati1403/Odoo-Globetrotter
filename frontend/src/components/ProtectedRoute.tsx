import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallbackPath = '/signin' 
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to signin with return path
  if (!user) {
    console.log('Protected route access denied. Redirecting to:', fallbackPath);
    console.log('Attempted to access:', location.pathname);
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // If authenticated, render the protected content
  console.log('Protected route access granted for:', location.pathname);
  return <>{children}</>;
};

export default ProtectedRoute;
