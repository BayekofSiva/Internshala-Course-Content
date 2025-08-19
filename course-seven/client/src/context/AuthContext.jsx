import React, { createContext, useEffect, useState } from 'react';
import axios from '../api/axios';


export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user on mount
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get('/api/auth/me', { withCredentials: true });
        if (res.data) setUser(res.data);
      } catch (err) {
        // Not logged in
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  // Login function
  const login = async (email, password) => {
    const res = await axios.post(
      '/api/auth/login',
      { email, password },
      { withCredentials: true }
    );
    setUser(res.data);
    return res.data;
  };

  // Register function
  const register = async (username, email, password) => {
    const res = await axios.post(
      '/api/auth/register',
      { username, email, password },
      { withCredentials: true }
    );
    setUser(res.data);
    return res.data;
  };

  // Logout function
  const logout = async () => {
    await axios.post('/api/auth/logout', {}, { withCredentials: true });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};