import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, saveToken, clearToken } from '../utils/secureStorage';
import * as authApi from '../api/auth.api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from SecureStore
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = await getToken();
        if (storedToken) {
          setTokenState(storedToken);
          const res = await authApi.getMe();
          setUser(res.data);
        }
      } catch (err) {
        await clearToken();
        setTokenState(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login(email, password);
    const { token: receivedToken, user: receivedUser } = res.data;
    await saveToken(receivedToken);
    setTokenState(receivedToken);
    setUser(receivedUser);
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await authApi.register(name, email, password);
    const { token: receivedToken, user: receivedUser } = res.data;
    await saveToken(receivedToken);
    setTokenState(receivedToken);
    setUser(receivedUser);
    return res.data;
  };

  const logout = async () => {
    await clearToken();
    setTokenState(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        register,
        logout,
      }}
    >
      {children}
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
