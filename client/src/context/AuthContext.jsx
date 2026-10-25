import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getMockAuthUser,
  setMockAuthUser,
  clearMockAuthUser,
  registerUser,
} from '../utils/storage.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => getMockAuthUser());

  const refreshUser = useCallback(() => {
    setCurrentUser(getMockAuthUser());
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      refreshUser();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshUser]);

  const login = (userData) => {
    const user = setMockAuthUser(userData);
    setCurrentUser(user);
    return user;
  };

  const register = ({ fullName, email, avatar }) => {
    const newUser = registerUser({ name: fullName, email, avatar });
    setCurrentUser(newUser);
    return newUser;
  };

  const logout = () => {
    clearMockAuthUser();
    setCurrentUser(null);
  };

  const updateProfile = (updates) => {
    if (!currentUser) return null;
    const updated = setMockAuthUser({
      ...currentUser,
      ...updates,
    });
    setCurrentUser(updated);
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: Boolean(currentUser),
        role: currentUser?.role || null,
        login,
        register,
        logout,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
