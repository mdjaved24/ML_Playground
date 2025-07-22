import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = () => {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('access'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refresh'));

  // Recommended token lifetimes (match these with your Django settings)
  const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000; // 15 minutes (shorter for security)
  const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const { exp } = jwtDecode(token);
      return Date.now() >= exp * 1000;
    } catch {
      return true;
    }
  };

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/token/refresh/`,
        { refresh: refreshToken }
      );
      
      const newAccessToken = response.data.access;
      const newRefreshToken = response.data.refresh || refreshToken; // Fallback to old if not rotated
      
      localStorage.setItem('access', newAccessToken);
      localStorage.setItem('refresh', newRefreshToken);
      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
      
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      clearTokensAndRedirect();
      return false;
    }
  };

  const clearTokensAndRedirect = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    window.location.href = '/login';
  };

  useEffect(() => {
    const checkAuth = async () => {
      // Initial token check
      if (!accessToken || isTokenExpired(accessToken)) {
        if (refreshToken && !isTokenExpired(refreshToken)) {
          await refreshAccessToken();
        } else {
          clearTokensAndRedirect();
        }
      }
      setIsCheckingAuth(false);
    };

    checkAuth();

    // Set up periodic token check (every 5 minutes)
    const interval = setInterval(checkAuth, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [accessToken, refreshToken]);

  if (isCheckingAuth) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Verifying session...</p>
      </div>
    );
  }

  if (!accessToken || isTokenExpired(accessToken)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;