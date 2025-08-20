import React, { createContext, useEffect, useState } from 'react';
import API from '../api'; // ✅ correct API instance

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user on mount
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await API.get('/auth/me');
        if (res.data) setUser(res.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    setUser(res.data);
    return res.data;
  };

  const register = async (username, email, password) => {
    const res = await API.post('/auth/register', { username, email, password });
    setUser(res.data);
    return res.data;
  };

  const logout = async () => {
    await API.post('/auth/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
