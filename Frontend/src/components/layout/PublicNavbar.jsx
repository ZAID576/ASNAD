import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const PublicNavbar = ({ theme = 'blue' }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', path: '/features' },
    { name: 'Security', path: '/security' },
    { name: 'Guides', path: '/guides' },
    { name: 'Contact', path: '/contact' },
  ];

  const isLight = scrolled || theme === 'white';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-200 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs text-black'
          : theme === 'white'
          ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 text-black'
          : 'bg-[#0A2E73]/95 backdrop-blur-md text-white border-b border-white/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo: Icon + Wordmark Together */}
        <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group select-none">
          <img
            src="/assets/asnad-icon-blue-transparent.png"
            alt="ASNAD Icon"
            onError={(e) => {
              e.currentTarget.src = '/logo.svg';
            }}
            className="w-7 h-7 sm:w-8 sm:h-8 object-contain transition-transform duration-200 group-hover:scale-105 flex-shrink-0"
          />
          <img
            src="/assets/asnad-wordmark-blue-transparent.png"
            alt="ASNAD"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
            className={`h-5 sm:h-6 w-auto object-contain transition-all duration-200 ${
              !isLight ? 'brightness-0 invert' : ''
            }`}
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`transition-colors py-1 ${
                  isActive
                    ? isLight
                      ? 'text-blue-600 border-b-2 border-blue-600 font-bold'
                      : 'text-white border-b-2 border-white font-bold'
                    : isLight
                    ? 'text-gray-600 hover:text-black'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Action CTAs */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <Link to="/dashboard">
              <button
                className={`text-xs font-bold px-4 py-2 rounded-sm transition flex items-center gap-1.5 ${
                  isLight
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-white text-[#0A2E73] hover:bg-white/90'
                }`}
              >
                <span>Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <button
                  className={`text-xs font-semibold px-3 py-2 rounded-sm transition ${
                    isLight ? 'text-gray-700 hover:text-black' : 'text-white/90 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
              </Link>
              <Link to="/register">
                <button
                  className={`text-xs font-bold px-4 py-2 rounded-sm transition flex items-center gap-1.5 ${
                    isLight
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-white text-[#0A2E73] hover:bg-white/90'
                  }`}
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-sm ${isLight ? 'text-black' : 'text-white'}`}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white text-black border-b border-gray-200 px-4 pt-3 pb-5 space-y-3 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs font-bold uppercase tracking-wider py-2 border-b border-gray-100 text-gray-800 hover:text-blue-600"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
              <button className="w-full py-2.5 text-xs font-bold text-center border border-gray-200 rounded-sm">
                Sign In
              </button>
            </Link>
            <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
              <button className="w-full py-2.5 text-xs font-bold text-center bg-blue-600 text-white rounded-sm">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicNavbar;
