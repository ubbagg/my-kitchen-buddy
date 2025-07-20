import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const navigationItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/recipes', label: 'Browse Recipes' },
    { path: '/generate-recipe', label: 'Generate Recipe' },
    { path: '/meal-planner', label: 'Meal Planner' },
    { path: '/shopping-list', label: 'Shopping List' },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group focus:outline-none">
              <div className="text-2xl group-hover:scale-110 transition-transform duration-200">🍳</div>
              <span className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors duration-200">
                AI Recipe Generator
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {isAuthenticated ? (
              <>
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-2 text-sm font-medium transition-all duration-200 relative focus:outline-none rounded-lg ${
                      isActiveRoute(item.path)
                        ? 'text-primary' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <span className="relative z-10">{item.label}</span>
                    {/* Active indicator */}
                    {isActiveRoute(item.path) && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                    )}
                    {/* Hover background */}
                    <div className="absolute inset-0 bg-gray-100 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-200" />
                  </Link>
                ))}
              </>
            ) : (
              <>
                <Link
                  to="/recipes"
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-all duration-200 relative focus:outline-none rounded-lg"
                >
                  <span className="relative z-10">Browse Recipes</span>
                  <div className="absolute inset-0 bg-gray-100 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-200" />
                </Link>
                <Link
                  to="/about"
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-all duration-200 relative focus:outline-none rounded-lg"
                >
                  <span className="relative z-10">About</span>
                  <div className="absolute inset-0 bg-gray-100 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-200" />
                </Link>
              </>
            )}
          </nav>

          {/* Auth Section - Rest remains the same */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <div className="hidden md:flex items-center space-x-3">
                  <div className="text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border">
                    Welcome, <span className="font-medium text-gray-900">{user?.name?.split(' ')[0]}!</span>
                  </div>
                  <Button 
                    onClick={handleLogout} 
                    variant="ghost" 
                    size="sm"
                    className="border border-gray-300 hover:border-red-300 hover:text-red-600 hover:bg-red-50"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </Button>
                </div>
                
                {/* Mobile menu button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all duration-200 active:scale-95 focus:outline-none"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation - Also remove focus boxes */}
        {isMenuOpen && isAuthenticated && (
          <div className="md:hidden border-t bg-white shadow-lg rounded-b-xl">
            <div className="px-2 py-3 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-4 py-3 text-base font-medium transition-all duration-200 rounded-lg relative focus:outline-none ${
                    isActiveRoute(item.path)
                      ? 'text-primary bg-primary bg-opacity-10' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
