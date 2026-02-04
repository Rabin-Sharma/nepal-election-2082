import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ totalCandidates, filteredCount, currentPath }) => {
  return (
    <header className="bg-surface border-b border-border sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <img 
              src="/images/logo.png" 
              alt="Logo" 
              className="h-12 w-12 object-contain"
            />
            
            <div>
              <h1 className="text-2xl font-bold text-text-primary">
                उम्मेदवार सूची
              </h1>
              <p className="text-sm text-text-secondary">
                नेपाल निर्वाचन आयोग
              </p>
            </div>
            
            {/* Navigation */}
            <nav className="flex gap-1">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPath === '/'
                    ? 'bg-primary text-white'
                    : 'text-text-secondary hover:bg-gray-100 hover:text-text-primary'
                }`}
              >
                उम्मेदवार
              </Link>
              <Link
                to="/dashboard"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPath === '/dashboard'
                    ? 'bg-primary text-white'
                    : 'text-text-secondary hover:bg-gray-100 hover:text-text-primary'
                }`}
              >
                ड्यासबोर्ड
              </Link>
            </nav>
          </div>
          
          <div className="text-sm text-text-secondary">
            <span className="font-medium text-primary">{filteredCount}</span>
            {filteredCount !== totalCandidates && (
              <span> / {totalCandidates}</span>
            )}
            <span> उम्मेदवार</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
