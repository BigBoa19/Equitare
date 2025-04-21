import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="p-4">
      <div className="container mx-auto grid grid-cols-3 items-center">
        <div className="font-bold text-primary-dark text-[40px]">Equitare</div>
        <div className="flex justify-center">
          <ul className="flex space-x-6 items-center">
            <li>
              <Link 
                to="/" 
                className={`${location.pathname === '/' ? 'text-primary' : 'text-black'} hover:text-primary-light`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/about" 
                className={`${location.pathname === '/about' ? 'text-primary' : 'text-black'} hover:text-primary-light`}
              >
                About
              </Link>
            </li>
            <li>
              <Link 
                to="/find-rides" 
                className={`${location.pathname === '/find-rides' ? 'text-primary' : 'text-black'} hover:text-primary-light`}
              >
                Find Rides
              </Link>
            </li>

            {isAuthenticated ? (
              <>
                <li>
                  <Link 
                    to="/messages" 
                    className={`${location.pathname.startsWith('/messages') ? 'text-primary' : 'text-black'} hover:text-primary-light flex items-center`}
                  >
                    Messages
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link 
                    to="/login" 
                    className={`${location.pathname === '/login' ? 'text-primary' : 'text-black'} hover:text-primary-light`}
                  >
                    Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
        <div className="flex justify-end">
          {isAuthenticated && (
            <div className="relative">
              <button 
                onClick={toggleDropdown}
                className="text-black hover:text-primary-light flex items-center"
              >
                <span className="mr-1">{user?.name || 'Account'}</span>
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Link 
                    to="/profile" 
                    className={`block px-4 py-2 text-sm ${location.pathname === '/profile' ? 'text-primary' : 'text-gray-700'} hover:bg-gray-100`}
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link 
                    to="/my-rides" 
                    className={`block px-4 py-2 text-sm ${location.pathname === '/my-rides' ? 'text-primary' : 'text-gray-700'} hover:bg-gray-100`}
                    onClick={() => setDropdownOpen(false)}
                  >
                    My Rides
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                    }} 
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 