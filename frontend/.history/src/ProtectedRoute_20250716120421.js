import { Outlet, Navigate } from 'react-router-dom';

const ProtectedRoute = () => {
  // returns the token string or null
  const token = localStorage.getItem('access');

  // !! converts a truthy/falsy value to a real boolean
  const isAuthenticated = !!token;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;