import React from 'react';
import './Footer.css'; // We'll create this next

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>© {new Date().getFullYear()} To-Do List App</p>
        <a 
          href="https://github.com/your-username/todo-list" 
          target="_blank" 
          rel="noopener noreferrer"
          className="github-link"
        >
          <i className="fab fa-github"></i> View on GitHub
        </a>
      </div>
    </footer>
  );
};

export default Footer;