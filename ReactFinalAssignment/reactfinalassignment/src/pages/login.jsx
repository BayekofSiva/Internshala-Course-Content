// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock authentication - replace with real auth logic
    localStorage.setItem('isAuthenticated', 'true');
    navigate('/checkout');
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={credentials.email}
          onChange={(e) => setCredentials({...credentials, email: e.target.value})}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) => setCredentials({...credentials, password: e.target.value})}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;