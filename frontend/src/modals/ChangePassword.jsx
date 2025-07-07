import { useState, useEffect } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Toaster, toast } from 'sonner';
import axios from 'axios';

function ChangePassword({ isOpen, onClose }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  // State for password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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


  const accessToken = localStorage.getItem('access');

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!accessToken) {
    toast.error('No access token found');
    console.warn('No access token found');
    return;
  }
  
  if (newPassword !== confirmPassword) {
    setError("Passwords don't match");
    toast.error("Passwords don't match");
    return;
  }
  
  setLoading(true);
  setError('');
  setSuccess('');

  const payload = {
    current_password: currentPassword,
    new_password: newPassword,
    confirm_password: confirmPassword
  }
  
  try {
    const response = await axios.post(`${API_URL}/user/change-password/`, payload, {
      headers: {
        'Content-Type': 'application/json',  // Add this header
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    // If we get here, the request was successful (2xx status)
    setSuccess('Password changed successfully!');
    toast.success('Password changed successfully!');
    console.log(response.data);
    setConfirmPassword('');
    setCurrentPassword('');
    setNewPassword('');
    setShowConfirmPassword(false);
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    
    setTimeout(() => {
      onClose();
      setSuccess('');
    }, 2000);
    
  } catch (err) {
    // Handle different error cases
    if (err.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const errorData = err.response.data;
      
      if (err.response.status === 400) {
        // Bad request - show validation errors from backend
        if (errorData.current_password) {
          setError(errorData.current_password[0]);  // Show first error
          toast.error(errorData.current_password[0]);  // Show first error
        } else if (errorData.new_password) {
          setError(errorData.new_password[0]);
          toast.error(errorData.new_password[0]);
        } else if (errorData.non_field_errors) {
          setError(errorData.non_field_errors[0]);
          toast.error(errorData.non_field_errors[0]);
        } else if (currentPassword == newPassword){
          setError('Current Password and New Password cannot be same');
          toast.error("Current Password and New Password cannot be same");
        }
        else {
          setError('Invalid request. Please check your inputs.');
          toast.error('Invalid request. Please check your inputs.');
        }
      } else if (err.response.status === 401) {
        setError('Session expired. Please login again.');
        toast.error('Session expired. Please login again.');
      } else {
        setError(errorData.detail || 'Failed to change password');
        toast.error(errorData.detail || 'Failed to change password');
      }
    } else if (err.request) {
      // The request was made but no response was received
      setError('Network error. Please check your connection.');
      toast.error('Network error. Please check your connection.');
    } else {
      // Something happened in setting up the request
      setError('An unexpected error occurred.');
      toast.error('An unexpected error occurred.');
    }
    
  } finally {
    setLoading(false);
  }
};

  if (!isOpen) return null;

  return (
    <>
      {/* Background overlay with blur - separate from modal content */}
      <div 
        className="fixed inset-0 bg-gray-200 bg-opacity-75 backdrop-blur-sm z-40"
        onClick={onClose}
      ></div>
      <Toaster richColors position="top-right"/>
      {/* Modal container - positioned above the blurred background */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-lg shadow-xl w-full max-w-md"
          onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
        >
          <div className="p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-[var(--color-primary-100)]">
                <svg className="h-6 w-6 text-[var(--color-primary-600)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="ml-4 w-full">
                <h3 className="text-lg font-medium text-[var(--color-gray-900)]">
                  Change Password
                </h3>
                <div className="mt-4">
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
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* Current Password Field */}
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          id="currentPassword"
                          name="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          required
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="block w-full px-3 py-2 border border-[var(--color-gray-300)] rounded-md focus:outline-none focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)] sm:text-sm pr-10"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center hover:cursor-pointer"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? (
                            <EyeSlashIcon className="h-5 w-5 text-[var(--color-gray-400)]" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-[var(--color-gray-400)]" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* New Password Field */}
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          id="newPassword"
                          name="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="block w-full px-3 py-2 border border-[var(--color-gray-300)] rounded-md focus:outline-none focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)] sm:text-sm pr-10"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center hover:cursor-pointer"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeSlashIcon className="h-5 w-5 text-[var(--color-gray-400)]" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-[var(--color-gray-400)]" />
                          )}
                        </button>
                      </div>
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

                    {/* Confirm Password Field */}
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="block w-full px-3 py-2 border border-[var(--color-gray-300)] rounded-md focus:outline-none focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)] sm:text-sm pr-10"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center hover:cursor-pointer"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeSlashIcon className="h-5 w-5 text-[var(--color-gray-400)]" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-[var(--color-gray-400)]" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="mt-5 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border border-[var(--color-gray-300)] rounded-md shadow-sm text-sm font-medium text-[var(--color-gray-700)] hover:bg-[var(--color-gray-50)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary-500)] hover:cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-700)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary-500)] hover:cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {loading ? 'Changing...' : 'Change Password'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChangePassword;