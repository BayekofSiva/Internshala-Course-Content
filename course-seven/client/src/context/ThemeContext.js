import React, { createContext, useEffect, useState } from 'react';
import { lightTheme, darkTheme } from '../styles/theme';

/**
 * ThemeContext provides the current colour palette and a toggle method.
 * It updates CSS variables on the `:root` element whenever the theme changes.
 */
export const ThemeContext = createContext({});

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState(() => {
    // Default to dark mode if the user’s system prefers it
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  // Apply theme variables to root on theme change
  useEffect(() => {
    const theme = themeName === 'light' ? lightTheme : darkTheme;
    Object.entries(theme).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);
    });
  }, [themeName]);

  const toggleTheme = () => {
    setThemeName(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ themeName, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};