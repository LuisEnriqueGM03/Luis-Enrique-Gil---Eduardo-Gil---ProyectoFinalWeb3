import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { state } = useAuth();

  // Show loading state while checking authentication
  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="text-secondary-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render children if authenticated
  return <>{children}</>;
};

export default ProtectedRoute; 