import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold text-gray-900">
              RatingApp
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <span className="text-sm text-gray-500 mr-4">
                  Welcome, {user.name} ({user.role})
                </span>
                {user.role === 'ADMIN' && (
                   <Link to="/admin/dashboard" className="text-sm font-medium text-gray-700 hover:text-blue-600">Dashboard</Link>
                )}
                {user.role === 'STORE_OWNER' && (
                   <Link to="/owner/dashboard" className="text-sm font-medium text-gray-700 hover:text-blue-600">My Stores</Link>
                )}
                {user.role === 'USER' && (
                   <Link to="/stores" className="text-sm font-medium text-gray-700 hover:text-blue-600">Browse Stores</Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="text-sm font-medium text-red-600 hover:text-red-800"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
