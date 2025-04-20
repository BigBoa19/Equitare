import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="bg-primary text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="font-bold text-xl">RideSplit</div>
        <ul className="flex space-x-6">
          <li>
            <Link to="/" className="hover:text-primary-light">Home</Link>
          </li>
          <li>
            <Link to="/find-rides" className="hover:text-primary-light">Find Rides</Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-primary-light">About</Link>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <Link to="/messages" className="hover:text-primary-light flex items-center">
                  Messages
                </Link>
              </li>
              <li className="relative group">
                <button className="hover:text-primary-light flex items-center">
                  <span className="mr-1">{user?.name || 'Account'}</span>
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <Link 
                    to="/my-rides" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    My Rides
                  </Link>
                  <button 
                    onClick={logout} 
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="hover:text-primary-light">Login</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar; 