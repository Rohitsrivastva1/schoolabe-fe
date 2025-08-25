import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        color: '#E6EDF3',
        fontSize: '1.1rem'
      }}>
        Loading...
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/signup" replace />;
  }

  // Check if user has admin role (you can modify this logic based on your user model)
  if (!user.isAdmin && !user.role?.includes('admin')) {
    return <Navigate to="/" replace />;
  }

  // Render the admin component if authenticated and authorized
  return children;
};

export default AdminRoute;
