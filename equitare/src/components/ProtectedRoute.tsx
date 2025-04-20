import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

const ProtectedRoute = ({ 
  children, 
  redirectTo = '/login' 
}: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading spinner while checking authentication status
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} />;
  }

  // If authenticated, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute; 