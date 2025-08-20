import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
// Import the CSS file that contains all styling and animations for the register page.
import '../styles/register.css';

/**
 * Register component renders a user registration form.
 * Styling has been refactored to use CSS classes rather than inline
 * style objects.  Animations and hover effects are handled purely in
 * CSS, inspired by the subtle transitions on overtake.gg.  Theme colours
 * are still pulled from CSS variables exposed by the ThemeContext.
 */
const Register = () => {
  const { register } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      return setError('Please fill all fields!');
    }
    setError('');
    setLoading(true);
    try {
      await register(username, email, password);
    } catch (err) {
      // Show server provided error message or fallback to generic text
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Registration failed!',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Register</h2>
      {error && <p className="register-error">{error}</p>}
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            id="username"
            type="text"
            className="form-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="primary-btn"
        >
          {loading ? 'Loading...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;