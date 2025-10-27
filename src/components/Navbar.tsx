import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Heart, Search } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-card/90 backdrop-blur-lg border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center">
              <Film className="w-7 h-7 text-white" />
            </div>
            <span className="text-xl font-bold">MovieMatch</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="flex items-center space-x-2 hover:text-primary-pink transition-colors"
            >
              <Film className="w-5 h-5" />
              <span className="hidden sm:inline">Discover</span>
            </Link>
            <Link
              to="/matches"
              className="flex items-center space-x-2 hover:text-primary-pink transition-colors"
            >
              <Heart className="w-5 h-5" />
              <span className="hidden sm:inline">Matches</span>
            </Link>
            <button className="flex items-center space-x-2 hover:text-primary-pink transition-colors">
              <Search className="w-5 h-5" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
