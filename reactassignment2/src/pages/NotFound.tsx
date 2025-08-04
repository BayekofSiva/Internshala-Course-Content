import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const NotFound = () => {
  return (
    <div className="not-found">
      <Navbar />
      <div className="container">
        <h1>404 - Page Not Found</h1>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="home-link">Return to Home Page</Link>
      </div>
    </div>
  );
};

export default NotFound;