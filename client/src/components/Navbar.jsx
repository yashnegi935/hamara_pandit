import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Gem, Menu, X, LogOut, User, Compass, History } from 'lucide-react';

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logoutUser();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Gemstones Catalog', path: '/catalog' },
    ...(user ? [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Saved Charts', path: '/saved-charts' }
    ] : [])
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-mystic-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-tr from-cosmic-600 to-gem-ruby text-slate-100 shadow-glow-sm transition-all group-hover:scale-105 group-hover:shadow-glow-md">
              <Gem className="h-5 w-5" />
            </div>
            <span className="font-serif text-xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-cosmic-200 to-cosmic-300">
              GemGuide <span className="text-cosmic-400">AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-cosmic-400 ${
                  isActive(link.path) ? 'text-cosmic-400' : 'text-slate-400'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {user ? (
              <div className="flex items-center gap-4 border-l border-slate-800 pl-4">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-cosmic-400" />
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-mystic-900/60 px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition-all cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 border-l border-slate-800 pl-4">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-slate-400 hover:text-slate-200 px-3 py-1.5"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-gradient-to-r from-cosmic-600 to-cosmic-700 px-4 py-2 text-xs font-semibold text-slate-100 shadow-glow-sm hover:from-cosmic-500 hover:to-cosmic-600 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg border border-slate-800 p-2 text-slate-400 hover:bg-slate-900 hover:text-slate-200"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-800 bg-mystic-950 px-4 py-4 md:hidden">
          <div className="space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-900 ${
                  isActive(link.path) ? 'text-cosmic-400 bg-slate-900/40' : 'text-slate-400'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {user ? (
              <div className="mt-4 border-t border-slate-800 pt-4 space-y-3">
                <div className="px-3 text-sm text-slate-300 flex items-center gap-2">
                  <User className="h-4 w-4 text-cosmic-400" />
                  Logged in as <span className="font-semibold text-slate-100">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-800 bg-mystic-900 px-4 py-2 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="mt-4 border-t border-slate-800 pt-4 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center rounded-lg border border-slate-800 px-4 py-2 text-sm font-medium text-slate-400 hover:bg-slate-900"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center rounded-lg bg-cosmic-600 px-4 py-2 text-sm font-semibold text-slate-100 shadow-glow-sm"
                >
                  Register / Try GemGuide
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
