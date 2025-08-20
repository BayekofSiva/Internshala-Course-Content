import React, { useContext, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
// Import context definitions with explicit .jsx extensions so Vite resolves the JSX files
import { ThemeContext } from '../context/ThemeContext.jsx';
import { AuthContext } from '../context/AuthContext.jsx';

/**
 * Header component.  Displays the hamburger menu, logo, search bar,
 * theme toggle and user info/sign‑in button.  The search bar updates the
 * query parameter `q` on the `/` route to filter videos by title.
 */
const Header = ({ onMenuClick }) => {
  const { themeName, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [input, setInput] = useState(searchParams.get('q') || '');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (input) {
      params.set('q', input);
    } else {
      params.delete('q');
    }
    setSearchParams(params);
    if (location.pathname !== '/') navigate('/');
  };

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0.5rem 1rem',
        backgroundColor: 'var(--surface)',
        borderBottom: `1px solid var(--muted)`
      }}
    >
      {/* Hamburger */}
      <button
        aria-label="Open menu"
        onClick={onMenuClick}
        style={{ marginRight: '1rem', fontSize: '1.5rem', color: 'var(--text)' }}
      >
        ≡
      </button>
      {/* Logo */}
      <h1
        onClick={() => navigate('/')}
        style={{ margin: 0, marginRight: '2rem', cursor: 'pointer', fontWeight: 700 }}
      >
        MyTube
      </h1>
      {/* Search bar */}
      <form onSubmit={handleSubmit} style={{ flex: 1, position: 'relative' }}>
        <input
          type="search"
          placeholder="Search"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            width: '100%',
            padding: '0.4rem 0.75rem',
            borderRadius: '4px',
            border: `1px solid var(--muted)`,
            backgroundColor: 'var(--bg)',
            color: 'var(--text)'
          }}
        />
      </form>
      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        style={{ marginLeft: '1rem', fontSize: '1.25rem', color: 'var(--text)' }}
      >
        {themeName === 'light' ? '🌙' : '☀️'}
      </button>
      {/* User section */}
      {user ? (
        <div style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '0.5rem' }}>Hi, {user.username}</span>
          <button
            onClick={logout}
            style={{ padding: '0.25rem 0.5rem', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '4px' }}
          >
            Logout
          </button>
        </div>
      ) : (
        <div style={{ marginLeft: '1rem' }}>
          <button
            onClick={() => navigate('/login')}
            style={{ padding: '0.25rem 0.5rem', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '4px' }}
          >
            Sign&nbsp;In
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;