import { createContext, useContext, useEffect, useState } from 'react';

/**
 * ThemeContext
 *
 * Provides a light/dark theme toggler to the application.  The current theme
 * value is stored in localStorage so that it persists across page reloads.  We
 * apply the theme by setting a data attribute on the document element,
 * allowing CSS to react to `[data-theme="dark"]` or `[data-theme="light"]`.
 */
const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or default to light
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};