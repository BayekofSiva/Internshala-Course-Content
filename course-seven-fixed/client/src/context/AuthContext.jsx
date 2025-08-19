import React, { createContext, useEffect, useState } from 'react';
import axios from '../api/axios';

/**
 * AuthContext manages the authentication state of the application.  It exposes
 * the current user object and helper methods to login, register and logout.
 *
 * The context checks the session on mount by calling `/api/auth/me`.  If a
 * session exists the user details are loaded into state.  All API requests
 * include `withCredentials: true` so that the session cookie is sent.
 */
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

  const API = axios.create({
  baseURL: "http://localhost:5000/api",   // ✅ backend port
  withCredentials: true,
});


  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};