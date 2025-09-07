import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function Register({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
    onSwitchToLogin,
  });
  const [error, setError] = useState('');
  const { register } = useAuth();

  const handleSubmit =async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.name || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    if(!formData.email.endsWith("@gmail.com")){
      setError('enter email address ends with @gmail.com');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const err = await register(formData);
    if(String(err).includes("auth/email-already-in-use")){
      setError('Email already in use');
      return;
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register for FoundIt</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </div>
        
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
            />
          </div>
          
          <button type="submit" className="auth-button">Register</button>
        </form>
        
        <div className="auth-switch">
          <span>Already have an account? </span>
          <button type="button" onClick={onSwitchToLogin} className="link-button">
            Login here
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;