import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * Register component.  Allows new users to create an account using a
 * username, email and password.  After successful registration the user is
 * redirected to the home page and automatically logged in.
 */
const Register = () => {
  const { register } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '2rem' }}>
      <h2>Register</h2>
      {error && <p style={{ color: 'var(--accent)' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ padding: '0.5rem', borderRadius: '4px', border: `1px solid var(--muted)`, backgroundColor: 'var(--surface)', color: 'var(--text)' }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '0.5rem', borderRadius: '4px', border: `1px solid var(--muted)`, backgroundColor: 'var(--surface)', color: 'var(--text)' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '0.5rem', borderRadius: '4px', border: `1px solid var(--muted)`, backgroundColor: 'var(--surface)', color: 'var(--text)' }}
        />
        <button
          type="submit"
          style={{ padding: '0.5rem', borderRadius: '4px', backgroundColor: 'var(--primary)', color: 'white', fontWeight: 'bold' }}
        >
          Register
        </button>
      </form>
      <p style={{ marginTop: '1rem' }}>
        Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Sign in</Link>
      </p>
    </div>
  );
};

export default Register;