import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

/**
 * Header component
 *
 * The header at the top of the page contains the hamburger button to toggle
 * the sidebar, a search bar, a theme toggle button and user
 * authentication controls.  When the user types a query and hits enter or
 * clicks the search icon, the parent `onSearch` handler is invoked.  The
 * theme toggle flips between light and dark modes using values provided by
 * the ThemeContext.  Authentication controls show a sign in button when no
 * user is logged in and the user's avatar, name and a sign out icon when
 * authenticated.
 */
const Header = ({ toggleSidebar, onSearch }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [searchValue, setSearchValue] = useState('');

  // Trigger search and navigate to home
  const handleSearch = () => {
    if (onSearch) onSearch(searchValue.trim());
    navigate('/');
  };

  // Execute search on Enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleAuthClick = () => {
    if (currentUser) {
      logout();
    } else {
      navigate('/login');
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="hamburger" onClick={toggleSidebar}>
          <i className="fas fa-bars"></i>
        </div>
        <div className="logo" onClick={() => navigate('/') }>
          <i className="fab fa-youtube"></i>
          <span>YouClone</span>
        </div>
      </div>
      
      <div className="header-center">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="search-button" onClick={handleSearch}>
            <i className="fas fa-search"></i>
          </button>
        </div>
        <div className="mic-button">
          <i className="fas fa-microphone"></i>
        </div>
      </div>
      
      <div className="header-right">
        {/* Theme toggle button */}
        <div className="header-icon" onClick={toggleTheme} title="Toggle theme">
          {theme === 'light' ? (
            <i className="fas fa-moon"></i>
          ) : (
            <i className="fas fa-sun"></i>
          )}
        </div>
        <div className="header-icon">
          <i className="fas fa-video"></i>
        </div>
        <div className="header-icon">
          <i className="fas fa-th"></i>
        </div>
        <div className="header-icon">
          <i className="fas fa-bell"></i>
        </div>
        <div className="user-auth" onClick={handleAuthClick}>
          {currentUser ? (
            <div className="user-menu">
              <img
                src={
                  currentUser.avatar ||
                  `https://ui-avatars.com/api/?name=${currentUser.username}&background=random`
                }
                alt={currentUser.username}
                className="user-avatar"
              />
              <span className="user-name">{currentUser.username}</span>
              <i className="fas fa-sign-out-alt"></i>
            </div>
          ) : (
            <div className="sign-in">
              <i className="fas fa-user-circle"></i>
              <span>SIGN IN</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;