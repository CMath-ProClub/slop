import React from 'react';
import { Link } from 'react-router-dom';
import { VideoCameraIcon } from '@heroicons/react/24/outline';

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <VideoCameraIcon className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">
              Clip Generator
            </span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link
              to="/library"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
            >
              📚 Browse Library
            </Link>
            <Link
              to="/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Create Clip
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
