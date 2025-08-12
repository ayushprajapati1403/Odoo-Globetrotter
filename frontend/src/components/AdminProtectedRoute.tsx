import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { isAdmin } from '../utils/permissions';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
  fallbackPath?: string;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ 
  children, 
  fallbackPath = '/my-trips' 
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

  // If not authenticated, redirect to signin
  if (!user) {
    console.log('Admin route access denied - not authenticated. Redirecting to signin');
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If not admin, redirect to fallback path
  if (!isAdmin(user)) {
    console.log('Admin route access denied - not admin. Redirecting to:', fallbackPath);
    return <Navigate to={fallbackPath} replace />;
  }

  // If admin, render the protected content
  console.log('Admin route access granted for:', location.pathname);
  return <>{children}</>;
};

export default AdminProtectedRoute;
