import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
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
        </ul>
      </div>
    </nav>
  );
};

export default Navbar; 