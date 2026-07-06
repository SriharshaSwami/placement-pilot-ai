import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMe, login as loginApi, register as registerApi, logout as logoutApi } from '../services/auth.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getMe();
        setUser(response.data.user);
      } catch (error) {
        if (error?.status === 401 || error?.response?.status === 401) {
          setUser(null);
        } else {
          console.error("Network or server error during auth check:", error);
          // Do not log the user out on network errors. Wait for next request.
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Listen for unauthorized events to automatically logout
    const handleUnauthorized = () => {
      setUser(null);
    };

    window.addEventListener('unauthorized', handleUnauthorized);
    return () => window.removeEventListener('unauthorized', handleUnauthorized);
  }, []);

  const login = async (credentials) => {
    const response = await loginApi(credentials);
    setUser(response.data.user);
    return response.data;
  };

  const register = async (userData) => {
    const response = await registerApi(userData);
    setUser(response.data.user);
    return response.data;
  };

  const logout = async () => {
    await logoutApi();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, isAuthenticated: !!user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
