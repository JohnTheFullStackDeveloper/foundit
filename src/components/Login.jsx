import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function Login({ onSwitchToRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit =async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    const success =await login(username, password);
    if (!success) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login to FoundIt</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Email</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your Email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          
          <button type="submit" className="auth-button">Login</button>
        </form>
        
        <div className="auth-switch">
          <span>Don't have an account? </span>
          <button type="button" onClick={onSwitchToRegister} className="link-button">
            Register here
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;