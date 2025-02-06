// src/components/Auth/LoginForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!formData.email || !formData.password) {
      setError("Please fill in both fields.");
      return;
    }
    // Simulate login (insert real auth logic or API call here)
    console.log("Logging in with", formData);
    // Redirect on successful login (adjust as needed)
    navigate('/');
  };

  return (
    <div className="glass-form">
      <h2>Login - PawfectCare</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            placeholder="example@gmail.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Password:</label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
            <button type="button" onClick={() => setPasswordVisible(!passwordVisible)}>
              {passwordVisible ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        {error && <span className="error">{error}</span>}
        <button type="submit" style={{ marginTop: '1rem' }}>Login</button>
      </form>
      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <span>Don't have an account? </span>
        <a href="/signup">Sign Up</a>
      </div>
    </div>
  );
};

export default LoginForm;
