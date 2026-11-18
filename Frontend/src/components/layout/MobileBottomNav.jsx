import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Files,
  FolderTree,
  Star,
  Trash2,
  Settings,
} from 'lucide-react';

export const MobileBottomNav = () => {
  const items = [
    { label: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Docs', path: '/documents', icon: Files },
    { label: 'Folders', path: '/categories', icon: FolderTree },
    { label: 'Starred', path: '/favorites', icon: Star },
    { label: 'Trash', path: '/trash', icon: Trash2 },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#111620]/95 backdrop-blur-md border-t border-gray-200 dark:border-white/10 safe-bottom">
      <div className="grid grid-cols-6 h-15 items-center px-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center h-full py-1 gap-1 transition-colors select-none ${
                  isActive
                    ? 'text-brand-blue font-semibold'
                    : 'text-gray-400 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`
              }
            >
              <Icon className="w-4.5 h-4.5" />
              <span className="text-[9.5px] tracking-tight">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
