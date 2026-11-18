import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/authApi';
import { driveApi } from '../api/driveApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Synchronous initial restore for instant 0ms page render
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('asnad_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [driveStatus, setDriveStatus] = useState(() => {
    try {
      const saved = localStorage.getItem('asnad_user');
      const u = saved ? JSON.parse(saved) : null;
      return u?.googleDrive || { connected: false };
    } catch (e) {
      return { connected: false };
    }
  });

  // If token exists and we already have cached user, loading is FALSE immediately (no splash screen lag)
  const [loading, setLoading] = useState(() => {
    try {
      const token = localStorage.getItem('asnad_token');
      const savedUser = localStorage.getItem('asnad_user');
      return !!(token && !savedUser);
    } catch (e) {
      return false;
    }
  });

  const fetchUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('asnad_token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const res = await authApi.getMe();
      if (res.success && res.data.user) {
        setUser(res.data.user);
        try { localStorage.setItem('asnad_user', JSON.stringify(res.data.user)); } catch (e) {}
        if (res.data.user.googleDrive) {
          setDriveStatus(res.data.user.googleDrive);
        }
      } else {
        setUser(null);
        try { localStorage.removeItem('asnad_user'); } catch (e) {}
      }
    } catch (err) {
      if (err?.code === 'UNAUTHORIZED' || err?.status === 401) {
        setUser(null);
        try { localStorage.removeItem('asnad_user'); } catch (e) {}
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshDriveStatus = useCallback(async () => {
    try {
      const res = await driveApi.getStatus();
      if (res.success && res.data) {
        setDriveStatus(res.data);
      }
    } catch (err) {
      console.warn('Failed to refresh drive status:', err);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    if (res.success && res.data.user) {
      if (res.data.token) {
        try { localStorage.setItem('asnad_token', res.data.token); } catch (e) {}
      }
      setUser(res.data.user);
      try { localStorage.setItem('asnad_user', JSON.stringify(res.data.user)); } catch (e) {}
      await fetchUser(); // get full profile with drive status
    }
    return res;
  };

  const register = async (userData) => {
    const res = await authApi.register(userData);
    if (res.success && res.data.user) {
      if (res.data.token) {
        try { localStorage.setItem('asnad_token', res.data.token); } catch (e) {}
      }
      setUser(res.data.user);
      try { localStorage.setItem('asnad_user', JSON.stringify(res.data.user)); } catch (e) {}
      await fetchUser();
    }
    return res;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.warn('Logout API error:', err);
    } finally {
      try {
        localStorage.removeItem('asnad_token');
        localStorage.removeItem('asnad_user');
        sessionStorage.clear();
      } catch (e) {}
      setUser(null);
      setDriveStatus({ connected: false });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        driveStatus,
        login,
        register,
        logout,
        refreshUser: fetchUser,
        refreshDriveStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
