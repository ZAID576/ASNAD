import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sun,
  Moon,
  CloudUpload,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../common/Button';

export const Header = ({ onOpenUpload }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-surface-dark-card/80 backdrop-blur-md border-b border-gray-200 dark:border-surface-dark-border px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3 sm:gap-4">
      {/* Brand: Icon Logo + Wordmark together on both Mobile & Desktop */}
      <Link to="/dashboard" className="flex items-center gap-2 sm:gap-2.5 group" aria-label="ASNAD Dashboard">
        <img
          src="/assets/asnad-icon-blue-transparent.png"
          alt="ASNAD Icon"
          onError={(e) => {
            e.currentTarget.src = '/logo.svg';
          }}
          className="w-7 h-7 sm:w-8 sm:h-8 object-contain flex-shrink-0 transition-transform group-hover:scale-105"
        />
        <img
          src="/assets/asnad-wordmark-blue-transparent.png"
          alt="ASNAD"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
          className="h-5 sm:h-6 w-auto object-contain dark:brightness-0 dark:invert"
        />
      </Link>

      {/* Right Actions: Upload Document + Theme Toggle + User Avatar */}
      <div className="flex items-center gap-1.5 sm:gap-3 ml-auto">
        {/* Quick Upload Button */}
        <Button
          variant="primary"
          size="sm"
          onClick={onOpenUpload}
          icon={CloudUpload}
          className="rounded-full shadow-sm text-xs py-1.5 px-2.5 sm:px-3"
        >
          <span className="hidden sm:inline">Upload Document</span>
          <span className="sm:hidden">Upload</span>
        </Button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-surface-dark-border transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* User Avatar */}
        <div
          onClick={() => navigate('/settings')}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-xs uppercase cursor-pointer hover:ring-2 hover:ring-brand-blue/30 transition-all flex-shrink-0"
          title={user?.email}
        >
          {user?.name?.charAt(0) || 'U'}
        </div>
      </div>
    </header>
  );
};
