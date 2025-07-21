import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';

/* 1️⃣  import the PNG / SVG logo you designed */
import Logo from '../../assets/Pinch of ai.png';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  /* Single source-of-truth for nav links */
  const nav = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/recipes', label: 'Browse Recipes' },
    { path: '/generate-recipe', label: 'Generate Recipe' },
    { path: '/meal-planner', label: 'Meal Planner' },
    { path: '/shopping-list', label: 'Shopping List' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white/70 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* 2️⃣  Logo (links to “/”) */}
        <Link to="/" className="flex items-center focus:outline-none">
          <img
            src={Logo}
            alt="AI Recipe Generator logo"
            className="h-8 w-auto sm:h-9 transition-transform duration-200 hover:scale-105"
          />
        </Link>

        {/* 3️⃣  Desktop nav */}
        <nav className="hidden md:flex items-center space-x-1">
          {isAuthenticated && nav.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`px-4 py-2 rounded-lg text-sm font-medium relative transition-all duration-200 focus:outline-none
                ${isActive(path)
                  ? 'text-primary'
                  : 'text-gray-600 hover:text-gray-900'}
              `}
            >
              <span className="relative z-10">{label}</span>
              {isActive(path) && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary rounded-full" />
              )}
              <span className="absolute inset-0 rounded-lg bg-gray-100 opacity-0 hover:opacity-100 transition-opacity duration-200" />
            </Link>
          ))}
        </nav>

        {/* 4️⃣  Right-hand side (auth buttons / hamburger) */}
        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <>
              {/* desktop greeting */}
              <span className="hidden md:inline-block text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border">
                Hi, <span className="font-medium text-gray-900">{user?.name?.split(' ')[0]}</span>
              </span>

              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="hidden md:inline-flex border border-gray-300 hover:border-red-300 hover:text-red-600 hover:bg-red-50"
              >
                Logout
              </Button>

              {/* hamburger toggler (mobile only) */}
              <button
                onClick={() => setOpen(!open)}
                className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition active:scale-95 focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {open
                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hidden md:inline-block">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/register" className="hidden md:inline-block">
                <Button size="sm">Sign Up</Button>
              </Link>

              {/* hamburger for guests */}
              <button
                onClick={() => setOpen(!open)}
                className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition active:scale-95 focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {open
                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      {/* 5️⃣  Mobile dropdown (slides in below header) */}
      {open && (
        <div className="md:hidden border-t bg-white shadow-lg">
          {isAuthenticated
            ? (
              <>
                {nav.map(({ path, label }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setOpen(false)}
                    className={`block px-4 py-3 text-base font-medium transition
                      ${isActive(path)
                        ? 'text-primary bg-primary/10'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}
                    `}
                  >
                    {label}
                  </Link>
                ))}
                <button
                  onClick={() => { setOpen(false); handleLogout(); }}
                  className="w-full text-left px-4 py-3 text-base text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            )
            : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="block px-4 py-3 text-base font-medium text-gray-600 hover:bg-gray-100">Login</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="block px-4 py-3 text-base font-medium text-gray-600 hover:bg-gray-100">Sign Up</Link>
              </>
            )}
        </div>
      )}
    </header>
  );
};

export default Header;
