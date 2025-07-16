import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';
import { Toaster, toast } from 'sonner';
import axios from 'axios';

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [securityQuestions, setSecurityQuestions] = useState([]);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [answers, setAnswers] = useState({});
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Password strength calculation
    let strength = 0;
    if (newPassword.length > 0) strength += 1;
    if (newPassword.length >= 8) strength += 1;
    if (/[A-Z]/.test(newPassword)) strength += 1;
    if (/[0-9]/.test(newPassword)) strength += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) strength += 1;
    setPasswordStrength(strength);
  }, [newPassword])
  
  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-200';
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength === 3) return 'bg-yellow-500';
    if (passwordStrength >= 4) return 'bg-green-500';
  };

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get(`${API_URL}/user/user-secret-question/${username}/`, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      setSecurityQuestions(response.data);
      setStep(2);
    } catch (err) {
      setLoading(false);
      if (err.response) {
        if (err.response.status === 404) {
          setError('User not found');
          toast.error('User not found. Please check the username and try again.');
        } else {
          const errorMsg = err.response.data?.detail || 
                        err.response.data?.message || 
                        'Failed to retrieve security questions';
          setError(errorMsg);
          toast.error(errorMsg);
        }
      } else if (err.request) {
        setError('Network error. Please check your connection.');
        toast.error('Network error. Please check your connection.');
      } else {
        setError('An unexpected error occurred.');
        toast.error('An unexpected error occurred.');
      }
    }
  };

  const handleSecurityAnswersSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  
  try {
    // 1. Prepare request data with debugging
    const requestData = securityQuestions.map(q => ({
      question_id: q.id,
      answer: (answers[q.question] || '').trim().toLowerCase()
    }));

    console.log("Request payload:", {
      url: `${API_URL}/user/verify-secret-answer/${username}/`,
      method: "POST",
      data: requestData
    });

    // 2. Make the API call with error handling
    const response = await axios.post(
      `${API_URL}/user/verify-secret-answer/${username}/`,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("Response:", response.data);

    // 3. Handle response
    if (response.status==200) {
      setStep(3);
      toast.success('Answers verified successfully!');
    } else {
      const errorMsg = response.data.message || 'Verification failed';
      setError(errorMsg);
      toast.error(errorMsg);
    }
  } catch (err) {
    console.error("Full error:", err);
    
    // Detailed error analysis
    let errorMsg = 'Verification failed';
    if (err.response) {
      console.error("Response data:", err.response.data);
      console.error("Status code:", err.response.status);
      
      if (err.response.status === 404) {
        errorMsg = `User not found`;
      } else {
        errorMsg = err.response.data?.detail || 
                  err.response.data?.message || 
                  `Server error (${err.response.status})`;
      }
    } else if (err.request) {
      errorMsg = 'No response from server';
      console.error("Request was made but no response:", err.request);
    } else {
      errorMsg = err.message || 'Request setup failed';
    }
    setError(errorMsg);
    toast.error(errorMsg);
  } finally {
    setLoading(false);
  }
};

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(
        `${API_URL}/user/reset-password/${username}/`,
        { new_password:newPassword, confirm_password:confirmPassword },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      if (response.status==200) {
        setSuccess('Password reset successfully! Redirecting to login...');
        toast.success('Password reset successfully!');
        setTimeout(() => navigate('/login'), 1000);
      } else {
        setError(response.data.message || 'Failed to reset password');
        toast.error(response.data.message || 'Failed to reset password');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (question, answer) => {
    setAnswers(prev => ({
      ...prev,
      [question]: answer
    }));
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
      <main className="flex-grow flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Styled Form Box */}
          <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-[var(--color-gray-200)]">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-accent-500)] p-6 text-center">
              <h2 className="text-2xl font-bold text-white">
                {step === 1 && 'Forgot Password'}
                {step === 2 && 'Security Questions'}
                {step === 3 && 'Reset Password'}
              </h2>
              <p className="mt-1 text-[var(--color-primary-100)]">
                {step === 1 && 'Enter your username to continue'}
                {step === 2 && 'Answer your security questions'}
                {step === 3 && 'Create a new password'}
              </p>
            </div>

            {/* Form Body */}
            <div className="p-6 sm:p-8">
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">
                  {success}
                </div>
              )}

              {step === 1 && (
                <form className="space-y-6" onSubmit={handleUsernameSubmit}>
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
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value.trim())}
                        className="block w-full pl-10 pr-3 py-2 border border-[var(--color-gray-300)] rounded-md focus:outline-none focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)] sm:text-sm"
                        placeholder="johndoe"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full flex justify-center hover:cursor-pointer py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-accent-500)] hover:from-[var(--color-primary-700)] hover:to-[var(--color-accent-600)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary-500)] transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {loading ? 'Processing...' : 'Continue'}
                    </button>
                  </div>
                </form>
              )}

              {step === 2 && (
                <form className="space-y-6" onSubmit={handleSecurityAnswersSubmit}>
                  {securityQuestions.map((q, index) => (
                    <div key={q.id || index}>
                      <label htmlFor={`answer-${index}`} className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
                        {q.question}
                      </label>
                      <input
                        id={`answer-${index}`}
                        type="text"
                        required
                        value={answers[q.question] || ''}
                        onChange={(e) => handleAnswerChange(q.question, e.target.value)}
                        className="block w-full px-3 py-2 border border-[var(--color-gray-300)] rounded-md focus:outline-none focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)] sm:text-sm"
                        placeholder="Your answer"
                      />
                    </div>
                  ))}

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="py-2 px-4 border border-[var(--color-gray-300)] rounded-md shadow-sm text-sm font-medium text-[var(--color-gray-700)] bg-white hover:bg-[var(--color-gray-50)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary-500)]"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-accent-500)] hover:from-[var(--color-primary-700)] hover:to-[var(--color-accent-600)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary-500)] transition `}
                    >
                      Verify 
                    </button>
                  </div>
                </form>
              )}

              {step === 3 && (
                <form className="space-y-6" onSubmit={handlePasswordReset}>
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
                      New Password
                    </label>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value.trim())}
                      className="block w-full px-3 py-2 border border-[var(--color-gray-300)] rounded-md focus:outline-none focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)] sm:text-sm"
                      placeholder="••••••••"
                    />
                    {newPassword && (
                            <div className="mt-2">
                              <div className="flex items-center mb-1">
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                  <div 
                                    className={`h-2.5 rounded-full ${getPasswordStrengthColor()}`}
                                    style={{ width: `${passwordStrength * 20}%` }}
                                  ></div>
                                </div>
                                <span className="ml-2 text-xs text-[var(--color-gray-600)]">
                                  {passwordStrength <= 2 ? 'Weak' : passwordStrength === 3 ? 'Good' : 'Strong'}
                                </span>
                              </div>
                              <ul className="text-xs text-[var(--color-gray-600)] list-disc list-inside">
                                <li className={newPassword.length >= 8 ? 'text-green-600' : ''}>At least 8 characters</li>
                                <li className={/[A-Z]/.test(newPassword) ? 'text-green-600' : ''}>Contains uppercase</li>
                                <li className={/[0-9]/.test(newPassword) ? 'text-green-600' : ''}>Contains number</li>
                              </ul>
                            </div>
                          )}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
                      Confirm New Password
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full px-3 py-2 border border-[var(--color-gray-300)] rounded-md focus:outline-none focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)] sm:text-sm"
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="py-2 px-4 border border-[var(--color-gray-300)] rounded-md shadow-sm text-sm font-medium text-[var(--color-gray-700)] bg-white hover:bg-[var(--color-gray-50)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary-500)]"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-accent-500)] hover:from-[var(--color-primary-700)] hover:to-[var(--color-accent-600)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary-500)] hover:cursor-pointer transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                  </div>
                </form>
              )}

              {/* Login Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-[var(--color-gray-600)]">
                  Remember your password?{' '}
                  <Link to="/login" className="font-medium text-[var(--color-primary-600)] hover:text-[var(--color-primary-500)]">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ForgotPassword;