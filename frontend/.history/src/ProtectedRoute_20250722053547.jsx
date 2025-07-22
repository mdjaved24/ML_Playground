import { Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';

const ProtectedRoute = () => {
  const token = localStorage.getItem('access');
  const refreshToken = localStorage.getItem('refresh');

  // Check if token exists and is valid (for JWT)
  const isTokenValid = (token) => {
    if (!token) return false;
    
    try {
      // If using JWT, check expiration
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch (e) {
      console.error('Token validation error:', e);
      return false;
    }
  };

  // Attempt silent token refresh
  const tryRefreshToken = async () => {
    if (!refreshToken) return false;
    
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/token/refresh/`, {
        refresh: refreshToken
      });
      
      localStorage.setItem('access', response.data.access);
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  };

  // Main authentication check
  const checkAuth = async () => {
    const tokenValid = isTokenValid(token);
    
    if (!tokenValid) {
      // Try to refresh token if available
      const refreshSuccess = await tryRefreshToken();
      
      if (!refreshSuccess) {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        window.location.href = '/login';
      }
    }
  };

  // Set up periodic checks
  useEffect(() => {
    // Initial check
    checkAuth();
    
    // Check every 5 minutes (adjust as needed)
    const interval = setInterval(checkAuth, 5 * 60 * 1000);
    
    // Also check when window gains focus
    const visibilityHandler = () => {
      if (!document.hidden) checkAuth();
    };
    
    window.addEventListener('visibilitychange', visibilityHandler);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('visibilitychange', visibilityHandler);
    };
  }, []);

  // Handle token validation on initial render
  if (!token || !isTokenValid(token)) {
    if (refreshToken) {
      // Attempt silent refresh before redirecting
      return <div>Checking session...</div>; // Or a loading spinner
    }
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;