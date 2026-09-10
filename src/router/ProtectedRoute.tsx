import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

interface ProtectedRouteProps {
  redirectPath?: string;
}

const ThreeDotsWaveLoader: React.FC = () => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white">
      <div className="flex items-center space-x-1.5">
        <div 
          className="w-2 h-2 bg-black rounded-full animate-bounce" 
          style={{ animationDelay: '0ms', animationDuration: '0.6s' }}
        />
        <div 
          className="w-2 h-2 bg-black rounded-full animate-bounce" 
          style={{ animationDelay: '150ms', animationDuration: '0.6s' }}
        />
        <div 
          className="w-2 h-2 bg-black rounded-full animate-bounce" 
          style={{ animationDelay: '300ms', animationDuration: '0.6s' }}
        />
      </div>
    </div>
  );
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ redirectPath = '/login' }) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("ProtectedRoute must be used within an AuthProvider");
  }

  const { isAuthenticated, user, isLoading } = authContext;

  if (isLoading) {
    return <ThreeDotsWaveLoader />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
