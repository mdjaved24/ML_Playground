// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import Footer from '../../components/Footer';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
  console.log("API_URL:", API_URL);  // Verify value

  const navigate = useNavigate();  // initialize the hook

  const handleSubmit = async (e) => {
  e.preventDefault();
  const payload = {
    username: username,
    password: password
  };


  try {
    const response = await axios.post(`${API_URL}/user/login/`, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log(response.data);
    if (response.status === 200 || response.status === 201) {
      localStorage.setItem('access', response.data.access);
      localStorage.setItem('refresh', response.data.refresh);
      toast.success('Login successful!');
      setShowPassword(false);
      setTimeout(() => {
        navigate('/home');
      }, 300);
      console.log('Login Successful');
    }
  } catch (error) {
    console.error('Login error:', error);
    
    // Handle different error cases
    if (!username || !password){
    console.log('Please enter the credentials');
    toast.warning('Please enter the credentials');
  }

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 401) {
        toast.error('Invalid username or password');
      } else if (error.response.status === 400) {
        toast.error('Bad request. Please check your input.');
      } else {
        toast.error('Login failed. Please try again.');
      }
    } else if (error.request) {
      // The request was made but no response was received
      toast.error('Network error. Please check your connection.');
    } else {
      // Something happened in setting up the request
      toast.error('An unexpected error occurred.');
    }
  }
};

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[var(--color-primary-50)] to-[var(--color-gray-50)]">
      {/* Header */}
      <Toaster richColors position="top-right"/>
      <header className="bg-white shadow-sm full-width">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-md bg-white flex items-center justify-center glow-effect">
              <svg className="h-5 w-5 text-[var(--color-primary-600)]" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12,2L1,12H4V22H20V12H23M11,15V18H13V15M15,15V18H17V15M7,15V18H9V15Z" />
              </svg>
            </div>
            <span className="ml-2 text-xl font-bold">ML Playground</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Styled Form Box */}
          <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-[var(--color-gray-200)]">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-accent-500)] p-6 text-center">
              <h2 className="text-2xl font-bold text-white">
                Welcome Back
              </h2>
              <p className="mt-1 text-[var(--color-primary-100)]">
                Sign in to continue to ML Playground
              </p>
            </div>

            {/* Form Body */}
            <div className="p-6 sm:p-8">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
                    Username
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-[var(--color-gray-400)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value.trim())}
                      className="block w-full pl-10 pr-3 py-2 border border-[var(--color-gray-300)] rounded-md focus:outline-none focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)] sm:text-sm"
                      placeholder="Username"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
                    Password
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-[var(--color-gray-400)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value.trim())}
                      className="block w-full pl-10 pr-3 py-2 border border-[var(--color-gray-300)] rounded-md focus:outline-none focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)] sm:text-sm"
                      placeholder={showPassword ? "Password" : "••••••••"}
                    />
                    <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center hover:cursor-pointer"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeSlashIcon className="h-5 w-5 text-[var(--color-gray-400)]" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-[var(--color-gray-400)]" />
                          )}
                        </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <Link to="/forgot-password" className="font-medium text-[var(--color-primary-600)] hover:text-[var(--color-primary-500)]">
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-accent-500)] hover:from-[var(--color-primary-700)] hover:to-[var(--color-accent-600)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary-500)] transition hover:cursor-pointer"
                  >
                    Sign in
                  </button>
                </div>
              </form>
            </div>

            {/* Form Footer */}
            <div className="bg-[var(--color-gray-50)] px-6 py-4 border-t border-[var(--color-gray-200)] text-center">
              <p className="text-sm text-[var(--color-gray-600)]">
                Don't have an account?{' '}
                <Link to="/signup" className="font-medium text-[var(--color-primary-600)] hover:text-[var(--color-primary-500)]">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Login;