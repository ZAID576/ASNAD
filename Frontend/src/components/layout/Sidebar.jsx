import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Files,
  FolderTree,
  Star,
  Trash2,
  Settings,
  HardDrive,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';

export const Sidebar = ({ isCollapsed = false, onToggleCollapse }) => {
  const { user, driveStatus, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'All Documents', path: '/documents', icon: Files },
    { name: 'Categories', path: '/categories', icon: FolderTree },
    { name: 'Favorites', path: '/favorites', icon: Star },
    { name: 'Trash', path: '/trash', icon: Trash2 },
    { name: 'Settings & Cloud', path: '/settings', icon: Settings },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col bg-white dark:bg-surface-dark-card border-r border-gray-200 dark:border-surface-dark-border h-screen sticky top-0 flex-shrink-0 z-30 select-none transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header: Logo + Close/Open Toggle Button (Where indicated in Image 1) */}
      <div
        className={`h-16 border-b border-gray-100 dark:border-surface-dark-border flex items-center px-4 ${
          isCollapsed ? 'justify-center relative' : 'justify-between'
        }`}
      >
        <NavLink
          to="/dashboard"
          className="flex items-center gap-2.5 overflow-hidden group"
          title="ASNAD Vault"
        >
          <img
            src="/assets/asnad-icon-blue-transparent.png"
            alt="ASNAD Icon"
            onError={(e) => {
              e.currentTarget.src = '/logo.svg';
            }}
            className="w-8 h-8 object-contain flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
          />
          {!isCollapsed && (
            <img
              src="/assets/asnad-wordmark-blue-transparent.png"
              alt="ASNAD"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
              className="h-6 w-auto object-contain dark:brightness-0 dark:invert transition-all duration-200"
            />
          )}
        </NavLink>

        {/* Close/Open Toggle Button in Sidebar Header (User Screenshot 1) */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className={`p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
              isCollapsed ? 'absolute -right-3 top-5 bg-white dark:bg-surface-dark-card border border-gray-200 dark:border-surface-dark-border shadow-xs' : ''
            }`}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-3.5 h-3.5 text-gray-600 dark:text-gray-300" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Navigation Links (Icons + Labels on expanded, Icons only on collapsed) */}
      <div className="flex-1 px-2.5 py-4 space-y-1.5 overflow-y-auto overflow-x-hidden">
        {!isCollapsed && (
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Navigation
          </div>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={isCollapsed ? item.name : undefined}
              className={({ isActive }) =>
                `flex items-center rounded-xl text-sm font-medium transition-all ${
                  isCollapsed
                    ? 'justify-center p-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60'
                    : 'gap-3 px-3 py-2.5'
                } ${
                  isActive
                    ? 'bg-brand-blue text-white shadow-sm hover:bg-brand-blue hover:text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="truncate">{item.name}</span>}
            </NavLink>
          );
        })}
      </div>

      {/* Google Drive Status Widget */}
      <div className="px-2.5 mb-3">
        {!isCollapsed ? (
          <div className="p-3 bg-gray-50 dark:bg-surface-dark-border/40 rounded-xl border border-gray-200/80 dark:border-surface-dark-border text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-brand-blue" />
                Google Drive
              </span>
              {driveStatus?.connected ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Connected
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-1.5 py-0.5 rounded-full">
                  Disconnected
                </span>
              )}
            </div>

            {driveStatus?.connected ? (
              <div className="space-y-0.5 text-gray-500 dark:text-gray-400 text-[11px]">
                <p className="truncate font-medium text-gray-700 dark:text-gray-300">
                  {driveStatus.googleEmail || 'Linked Account'}
                </p>
                <p className="text-[10px] text-gray-400">Folder: /Asnad</p>
              </div>
            ) : (
              <div className="mt-2">
                <p className="text-[11px] text-gray-500 mb-2 leading-tight">
                  Connect Drive for cloud storage
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/settings')}
                  className="w-full text-xs py-1"
                >
                  Connect Drive
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-gray-50 dark:bg-surface-dark-border/40 border border-gray-200/80 dark:border-surface-dark-border cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title={`Google Drive: ${driveStatus?.connected ? 'Connected' : 'Disconnected'}`}
            onClick={() => navigate('/settings')}
          >
            <HardDrive className="w-4 h-4 text-brand-blue" />
            <span
              className={`w-2 h-2 rounded-full mt-1 ${
                driveStatus?.connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
          </div>
        )}
      </div>

      {/* User Snippet & Logout */}
      <div
        className={`p-3 border-t border-gray-100 dark:border-surface-dark-border flex items-center ${
          isCollapsed ? 'flex-col gap-2 justify-center' : 'justify-between'
        }`}
      >
        <div
          className="flex items-center gap-2.5 overflow-hidden cursor-pointer"
          onClick={() => navigate('/settings')}
          title={user?.email}
        >
          <div className="w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
            {user?.name?.charAt(0) || 'U'}
          </div>
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">
                {user?.name || 'User'}
              </span>
              <span className="text-[10px] text-gray-400 truncate">
                {user?.email}
              </span>
            </div>
          )}
        </div>
        <button
          onClick={logout}
          title="Sign out"
          className="p-1.5 rounded-lg text-gray-400 hover:text-brand-red hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
