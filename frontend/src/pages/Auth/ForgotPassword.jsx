import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';

function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: username input, 2: security questions, 3: password reset
  const [username, setUsername] = useState('');
  const [securityQuestions, setSecurityQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Mock API call - replace with your actual API call
      const response = await fetch('/api/auth/get-security-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSecurityQuestions(data.questions);
        setStep(2);
      } else {
        setError(data.message || 'Failed to retrieve security questions');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSecurityAnswersSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Mock API call - replace with your actual API call
      const response = await fetch('/api/auth/verify-security-answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          answers: Object.entries(answers).map(([question, answer]) => ({
            question,
            answer
          }))
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStep(3);
      } else {
        setError(data.message || 'Security answers do not match our records');
      }
    } catch (err) {
      setError('Network error. Please try again.');
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
      // Mock API call - replace with your actual API call
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          newPassword
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess('Password reset successfully! Redirecting to login...');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      setError('Network error. Please try again.');
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
                        onChange={(e) => setUsername(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-[var(--color-gray-300)] rounded-md focus:outline-none focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)] sm:text-sm"
                        placeholder="johndoe"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-accent-500)] hover:from-[var(--color-primary-700)] hover:to-[var(--color-accent-600)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary-500)] transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {loading ? 'Processing...' : 'Continue'}
                    </button>
                  </div>
                </form>
              )}

              {step === 2 && (
                <form className="space-y-6" onSubmit={handleSecurityAnswersSubmit}>
                  {securityQuestions.map((question, index) => (
                    <div key={index}>
                      <label htmlFor={`answer-${index}`} className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
                        {question}
                      </label>
                      <input
                        id={`answer-${index}`}
                        type="text"
                        required
                        value={answers[question] || ''}
                        onChange={(e) => handleAnswerChange(question, e.target.value)}
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
                      disabled={loading}
                      className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-accent-500)] hover:from-[var(--color-primary-700)] hover:to-[var(--color-accent-600)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary-500)] transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {loading ? 'Verifying...' : 'Verify Answers'}
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
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="block w-full px-3 py-2 border border-[var(--color-gray-300)] rounded-md focus:outline-none focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)] sm:text-sm"
                      placeholder="••••••••"
                    />
                    <p className="mt-2 text-xs text-[var(--color-gray-500)]">
                      Password must be at least 8 characters long and contain a number and uppercase letter.
                    </p>
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
                      className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-accent-500)] hover:from-[var(--color-primary-700)] hover:to-[var(--color-accent-600)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary-500)] transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
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