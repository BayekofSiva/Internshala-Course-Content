import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * Login component.  Presents a simple form for entering an email and
 * password.  On successful login the user is redirected to the home page.
 */
const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '2rem' }}>
      <h2>Sign In</h2>
      {error && <p style={{ color: 'var(--accent)' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
          Sign In
        </button>
      </form>
      <p style={{ marginTop: '1rem' }}>
        Don't have an account? <Link to="/register" style={{ color: 'var(--primary)' }}>Register</Link>
      </p>
    </div>
  );
};

export default Login;