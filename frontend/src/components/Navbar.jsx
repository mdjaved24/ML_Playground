// Navigation Component (can be placed in a separate file like components/Navbar.jsx)
import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="gradient-header text-white shadow-lg sticky top-0 z-50 full-width">
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
              to="/" 
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
              My Models
            </NavLink>
            
            <NavLink 
              to="/templates" 
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
            
            <button className="btn-accent ml-4 px-4 py-2 rounded-md transition glow-effect">
              New Project
            </button>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden text-white">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
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
        </div>
      </div>
    </nav>
  );
}

export default Navbar;