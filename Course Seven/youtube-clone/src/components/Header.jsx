// Updated src/components/Header.jsx
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = ({ toggleSidebar }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

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
        <div className="logo" onClick={() => navigate('/')}>
          <i className="fab fa-youtube"></i>
          <span>YouClone</span>
        </div>
      </div>
      
      <div className="header-center">
        <div className="search-container">
          <input type="text" className="search-input" placeholder="Search" />
          <button className="search-button">
            <i className="fas fa-search"></i>
          </button>
        </div>
        <div className="mic-button">
          <i className="fas fa-microphone"></i>
        </div>
      </div>
      
      <div className="header-right">
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
                src={currentUser.avatar || `https://ui-avatars.com/api/?name=${currentUser.username}&background=random`} 
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