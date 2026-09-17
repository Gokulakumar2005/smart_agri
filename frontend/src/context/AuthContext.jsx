import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('smartagri_token'));
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (currentToken = token) => {
    if (!currentToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.get('/api/user/me', {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      setUser(data.user || data);
    } catch (error) {
      localStorage.removeItem('smartagri_token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile(token);
  }, [token]);

  const login = async (payload) => {
    const { data } = await api.post('/api/auth/login', payload);
    localStorage.setItem('smartagri_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (payload) => {
    const { data } = await api.post('/api/auth/register', payload);
    localStorage.setItem('smartagri_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('smartagri_token');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ user, token, loading, login, register, logout, fetchProfile }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
