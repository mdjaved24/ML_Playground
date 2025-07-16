import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import ChangePasswordModal from '../modals/ChangePassword';
import axios from 'axios';


function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const dropdownRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL;


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navigate = useNavigate(); // if in a component
  const refreshToken = localStorage.getItem('refresh');

  const handleLogout = async () => {

  if (!refreshToken) {
    toast.error('No refresh token found');
    console.warn('No refresh token found');
    return;
  }

  try {
    await axios.post(`${API_URL}/user/logout/`, {
      refresh_token: refreshToken,
    });

    // Clear stored tokens
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    toast.success('Logout successful!');

    setTimeout(() => {
          navigate('/login');
        }, 500); // delay navigation for 0.5 seconds
    console.log('Logout Successful');

  } catch (error) {
    console.error('Logout failed:', error.response?.data || error.message);
  }
};

  return (
    <>
      <nav className="gradient-header text-white shadow-lg sticky top-0 z-40 full-width">
        <Toaster richColors position="top-right"/>
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center max-w-7xl mx-auto">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-md bg-white flex items-center justify-center glow-effect">
                <svg className="h-5 w-5 text-[var(--color-primary-600)]" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12,2L1,12H4V22H20V12H23M11,15V18H13V15M15,15V18H17V15M7,15V18H9V15Z" />
                </svg>
              </div>
              <span className="ml-2 text-xl font-bold">ML Playground</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <NavLink 
                to="/home" 
                className={({isActive}) => `px-4 py-2 rounded-md transition ${isActive ? 'bg-white/10 font-medium' : 'hover:bg-white/5'}`}
              >
                Home
              </NavLink>
              
              <NavLink 
                to="/playground" 
                className={({isActive}) => `px-4 py-2 rounded-md transition ${isActive ? 'bg-white/10 font-medium' : 'hover:bg-white/5'}`}
              >
                Playground
              </NavLink>
              
              <NavLink 
                to="/models" 
                className={({isActive}) => `px-4 py-2 rounded-md transition ${isActive ? 'bg-white/10 font-medium' : 'hover:bg-white/5'}`}
              >
                Models
              </NavLink>
              
              <NavLink 
                to="/dashboard" 
                className={({isActive}) => `px-4 py-2 rounded-md transition ${isActive ? 'bg-white/10 font-medium' : 'hover:bg-white/5'}`}
              >
                Dashboard
              </NavLink>
              
              <NavLink 
                to="/learn" 
                className={({isActive}) => `px-4 py-2 rounded-md transition ${isActive ? 'bg-white/10 font-medium' : 'hover:bg-white/5'}`}
              >
                Learn
              </NavLink>
              
              {/* <button className="btn-accent ml-4 px-4 py-2 rounded-md transition glow-effect">
                New Project
              </button> */}
            </div>

            {/* Profile dropdown */}
            <div className="flex items-center ml-4" ref={dropdownRef}>
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white hover:cursor-pointer"
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </button>

                {isProfileOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <NavLink
                      to="/profile"
                      className="block px-4 py-2 text-sm text-[var(--color-gray-700)] hover:bg-[var(--color-gray-100)] hover:cursor-pointer"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Profile
                    </NavLink>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        setShowChangePasswordModal(true);
                      }}
                      className="w-full text-left block px-4 py-2 text-sm text-[var(--color-gray-700)] hover:bg-[var(--color-gray-100)] hover:cursor-pointer"
                    >
                      Change Password
                    </button>
                    {/* <NavLink
                      to="/settings"
                      className="block px-4 py-2 text-sm text-[var(--color-gray-700)] hover:bg-[var(--color-gray-100)] hover:cursor-pointer"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Settings
                    </NavLink> */}
                    <div className="border-t border-[var(--color-gray-200)] my-1"></div>
                    <button
                      className="block px-4 py-2 text-sm text-[var(--color-gray-700)] hover:bg-[var(--color-gray-100)] hover:cursor-pointer"
                      onClick={handleLogout}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <button className="md:hidden text-white ml-4">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation (would appear when menu is toggled) */}
        <div className="md:hidden bg-[var(--color-primary-800)]">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLink to="/" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10">
              Home
            </NavLink>
            <NavLink to="/playground" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10">
              Playground
            </NavLink>
            <NavLink to="/models" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10">
              My Models
            </NavLink>
            <NavLink to="/templates" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10">
              Templates
            </NavLink>
            <NavLink to="/learn" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10">
              Learn
            </NavLink>
            <div className="border-t border-white/20 pt-2 mt-1">
              <NavLink to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10">
                Profile
              </NavLink>
              <button
                onClick={() => setShowChangePasswordModal(true)}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10"
              >
                Change Password
              </button>
              <button
                      className="block px-4 py-2 text-sm text-[var(--color-gray-700)] hover:bg-[var(--color-gray-100)]"
                      onClick={handleLogout}
                    >
                      Sign out
                    </button>
            </div>
          </div>
        </div>
      </nav>

      <ChangePasswordModal 
        isOpen={showChangePasswordModal} 
        onClose={() => setShowChangePasswordModal(false)} 
      />
    </>
  );
}

export default Navbar;