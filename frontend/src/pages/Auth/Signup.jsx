// src/pages/Signup.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../components/Footer';

function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    secretQuestion1: '',
    secretAnswer1: '',
    secretQuestion2: '',
    secretAnswer2: ''
  });

  const [emailValid, setEmailValid] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordMatch, setPasswordMatch] = useState(true);

  const secretQuestions = [
    "What was your first pet's name?",
    "What city were you born in?",
    "What is your mother's maiden name?",
    "What was your first school name?",
    "What is your favorite book?"
  ];

  useEffect(() => {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(emailRegex.test(formData.email));

    // Password strength calculation
    let strength = 0;
    if (formData.password.length > 0) strength += 1;
    if (formData.password.length >= 8) strength += 1;
    if (/[A-Z]/.test(formData.password)) strength += 1;
    if (/[0-9]/.test(formData.password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength += 1;
    setPasswordStrength(strength);

    // Password match validation
    setPasswordMatch(formData.password === formData.confirmPassword || formData.confirmPassword === '');
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!emailValid || passwordStrength < 3 || !passwordMatch) return;
    console.log(formData);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-200';
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength === 3) return 'bg-yellow-500';
    if (passwordStrength >= 4) return 'bg-green-500';
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
        <div className="w-full max-w-4xl"> {/* Increased width */}
          {/* Styled Form Box */}
          <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-[var(--color-gray-200)]">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-accent-500)] p-6 text-center">
              <h2 className="text-2xl font-bold text-white">
                Create Your Account
              </h2>
              <p className="mt-1 text-[var(--color-primary-100)]">
                Join ML Playground today
              </p>
            </div>

            {/* Form Body - Two Column Layout */}
            <div className="p-6 sm:p-8">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> {/* Two column layout */}
                  {/* Left Column */}
                  <div className="space-y-4">
                    {/* Personal Info */}
                    <div>
                      <h3 className="text-lg font-medium text-[var(--color-gray-900)] mb-4 pb-2 border-b border-[var(--color-gray-200)]">
                        Personal Information
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
                            First Name
                          </label>
                          <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            required
                            value={formData.firstName}
                            onChange={handleChange}
                            className="block w-full px-3 py-2 border border-[var(--color-gray-300)] rounded-md focus:outline-none focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)] sm:text-sm"
                            placeholder="John"
                          />
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
                            Last Name
                          </label>
                          <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            required
                            value={formData.lastName}
                            onChange={handleChange}
                            className="block w-full px-3 py-2 border border-[var(--color-gray-300)] rounded-md focus:outline-none focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)] sm:text-sm"
                            placeholder="Doe"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Account Info */}
                    <div>
                      <h3 className="text-lg font-medium text-[var(--color-gray-900)] mb-4 pb-2 border-b border-[var(--color-gray-200)]">
                        Account Details
                      </h3>
                      <div className="space-y-4">
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
                              value={formData.username}
                              onChange={handleChange}
                              className="block w-full pl-10 pr-3 py-2 border border-[var(--color-gray-300)] rounded-md focus:outline-none focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)] sm:text-sm"
                              placeholder="johndoe"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
                            Email
                          </label>
                          <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg className="h-5 w-5 text-[var(--color-gray-400)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <input
                              id="email"
                              name="email"
                              type="email"
                              autoComplete="email"
                              required
                              value={formData.email}
                              onChange={handleChange}
                              className={`block w-full pl-10 pr-3 py-2 border ${emailValid || !formData.email ? 'border-[var(--color-gray-300)]' : 'border-red-300'} rounded-md focus:outline-none focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)] sm:text-sm`}
                              placeholder="you@example.com"
                            />
                          </div>
                          {formData.email && !emailValid && (
                            <p className="mt-1 text-sm text-red-600">Please enter a valid email address</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    {/* Password Fields */}
                    <div>
                      <h3 className="text-lg font-medium text-[var(--color-gray-900)] mb-4 pb-2 border-b border-[var(--color-gray-200)]">
                        Security Information
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="password" className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
                            Password
                          </label>
                          <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="block w-full px-3 py-2 border border-[var(--color-gray-300)] rounded-md focus:outline-none focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)] sm:text-sm"
                            placeholder="••••••••"
                          />
                          {formData.password && (
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
                                <li className={formData.password.length >= 8 ? 'text-green-600' : ''}>At least 8 characters</li>
                                <li className={/[A-Z]/.test(formData.password) ? 'text-green-600' : ''}>Contains uppercase</li>
                                <li className={/[0-9]/.test(formData.password) ? 'text-green-600' : ''}>Contains number</li>
                              </ul>
                            </div>
                          )}
                        </div>

                        <div>
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
                            Confirm Password
                          </label>
                          <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            required
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`block w-full px-3 py-2 border ${passwordMatch ? 'border-[var(--color-gray-300)]' : 'border-red-300'} rounded-md focus:outline-none focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)] sm:text-sm`}
                            placeholder="••••••••"
                          />
                          {!passwordMatch && formData.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">Passwords don't match</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Security Questions */}
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="secretQuestion1" className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
                          Security Question 1
                        </label>
                        <select
                          id="secretQuestion1"
                          name="secretQuestion1"
                          required
                          value={formData.secretQuestion1}
                          onChange={handleChange}
                          className="block w-full px-3 py-2 border border-[var(--color-gray-300)] rounded-md focus:outline-none focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)] sm:text-sm"
                        >
                          <option value="">Select a question</option>
                          {secretQuestions.map((question, index) => (
                            <option key={index} value={question}>{question}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          name="secretAnswer1"
                          required
                          value={formData.secretAnswer1}
                          onChange={handleChange}
                          className="block w-full mt-2 px-3 py-2 border border-[var(--color-gray-300)] rounded-md focus:outline-none focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)] sm:text-sm"
                          placeholder="Your answer"
                        />
                      </div>

                      <div>
                        <label htmlFor="secretQuestion2" className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
                          Security Question 2
                        </label>
                        <select
                          id="secretQuestion2"
                          name="secretQuestion2"
                          required
                          value={formData.secretQuestion2}
                          onChange={handleChange}
                          className="block w-full px-3 py-2 border border-[var(--color-gray-300)] rounded-md focus:outline-none focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)] sm:text-sm"
                        >
                          <option value="">Select a question</option>
                          {secretQuestions.filter(q => q !== formData.secretQuestion1).map((question, index) => (
                            <option key={`2-${index}`} value={question}>{question}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          name="secretAnswer2"
                          required
                          value={formData.secretAnswer2}
                          onChange={handleChange}
                          className="block w-full mt-2 px-3 py-2 border border-[var(--color-gray-300)] rounded-md focus:outline-none focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)] sm:text-sm"
                          placeholder="Your answer"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={!emailValid || passwordStrength < 3 || !passwordMatch}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-accent-500)] hover:from-[var(--color-primary-700)] hover:to-[var(--color-accent-600)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary-500)] transition ${(!emailValid || passwordStrength < 3 || !passwordMatch) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Create Account
                  </button>
                </div>
              </form>

              {/* Login Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-[var(--color-gray-600)]">
                  Already have an account?{' '}
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

export default Signup;