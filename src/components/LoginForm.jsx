import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const LoginForm = () => {
  // State for regular login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // State for admin access
  const [hoverCount, setHoverCount] = useState(0);
  const [requiredHovers, setRequiredHovers] = useState(2);
  const [showPopup, setShowPopup] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);

  // Hooks
  const navigate = useNavigate();
  const { login } = useAuth();

  // Regular login handlers
  const handleEmailChange = (e) => setEmail(e.target.value.trim());
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in both email and password fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      const { token, user } = response.data;
      const loginSuccess = login(token, user);

      if (loginSuccess) {
        navigate('/', { replace: true });
      } else {
        setError('Login failed: Invalid response from server.');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response) {
        if (err.response.status === 404) {
          setError('Login service unavailable. Please check the backend server.');
        } else if (err.response.data?.message) {
          setError(err.response.data.message);
        } else if (err.response.data?.error) {
          setError(err.response.data.error);
        } else {
          setError('Login failed. Please check your credentials.');
        }
      } else if (err.request) {
        setError('Unable to connect to the server. Check your network.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Admin popup trigger
  useEffect(() => {
    if (hoverCount >= requiredHovers) {
      setShowPopup(true);
      setHoverCount(0);
    }
  }, [hoverCount, requiredHovers]);

  // Admin access — authenticates against the server and requires role 'admin'.
  // The secret hover reveal is kept as an easter egg, but it no longer grants
  // anything by itself: credentials are verified by the API, and every admin
  // endpoint independently enforces `requireAdmin`.
  const handleAdminSubmit = async () => {
    setAdminError('');

    if (!adminEmail || !adminPassword) {
      setAdminError('Enter both email and password.');
      return;
    }

    setAdminLoading(true);
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/login`,
        { email: adminEmail, password: adminPassword }
      );

      if (data?.user?.role !== 'admin') {
        setAdminError('This account does not have admin access.');
        setAdminPassword('');
        return;
      }

      if (login(data.token, data.user)) {
        navigate('/admin', { replace: true });
      } else {
        setAdminError('Login failed: invalid response from server.');
      }
    } catch (err) {
      setAdminError(
        err.response?.data?.message || err.response?.data?.error || 'Invalid credentials.'
      );
      setAdminPassword('');
      setShowPopup(false);
      setRequiredHovers((prev) => prev + 1);
    } finally {
      setAdminLoading(false);
    }
  };

  return (
    <div className="glass-form" style={{ position: 'relative', maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      {/* Back to Home Button */}
      <button
        className="back-home-button"
        onClick={() => navigate('/')}
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          padding: '8px 16px',
          fontSize: '1rem',
          border: 'none',
          borderRadius: '5px',
          backgroundColor: '#14B8A6',
          color: '#fff',
          cursor: 'pointer',
          transition: 'background-color 0.3s',
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = '#0d9488')}
        onMouseOut={(e) => (e.target.style.backgroundColor = '#14B8A6')}
      >
        Home
      </button>

      {/* Form Title */}
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Login - PawfectCare</h2>

      {/* Login Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        {/* Email Field */}
        <div>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={handleEmailChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              fontSize: '1rem',
            }}
          />
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Password:
          </label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type={passwordVisible ? 'text' : 'password'}
              id="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
              required
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                fontSize: '1rem',
              }}
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              style={{
                marginLeft: '10px',
                padding: '8px 12px',
                fontSize: '0.9rem',
                border: 'none',
                borderRadius: '5px',
                backgroundColor: '#14B8A6',
                color: '#fff',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#0d9488')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#14B8A6')}
            >
              {passwordVisible ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <span className="error" style={{ color: 'red', textAlign: 'center', fontSize: '0.9rem' }}>
            {error}
          </span>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          style={{
            marginTop: '1rem',
            padding: '10px 20px',
            fontSize: '1rem',
            border: 'none',
            borderRadius: '5px',
            backgroundColor: isLoading ? '#ccc' : '#14B8A6',
            color: '#fff',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s',
          }}
          onMouseOver={(e) => !isLoading && (e.target.style.backgroundColor = '#0d9488')}
          onMouseOut={(e) => !isLoading && (e.target.style.backgroundColor = '#14B8A6')}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {/* Signup Link */}
      <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
        <span>Don't have an account? </span>
        <a
          href="/signup"
          style={{ color: '#14B8A6', textDecoration: 'none' }}
          onMouseOver={(e) => (e.target.style.textDecoration = 'underline')}
          onMouseOut={(e) => (e.target.style.textDecoration = 'none')}
        >
          Sign Up
        </a>
      </div>

      {/* Hover area for admin */}
      <div
        className="hover-area"
        onMouseEnter={() => setHoverCount((prev) => prev + 1)}
      />

      {/* Admin popup */}
      {showPopup && (
        <motion.div
          className="admin-popup"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <input
            type="email"
            placeholder="Admin email"
            autoComplete="username"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value.trim())}
            onKeyDown={(e) => e.key === 'Enter' && handleAdminSubmit()}
            disabled={adminLoading}
          />
          <input
            type="password"
            placeholder="Admin password"
            autoComplete="current-password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdminSubmit()}
            disabled={adminLoading}
          />
          {adminLoading && <p style={{ margin: '6px 0 0', fontSize: '0.8rem' }}>Checking…</p>}
          {adminError && (
            <p style={{ color: '#ef4444', margin: '6px 0 0', fontSize: '0.8rem' }}>{adminError}</p>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default LoginForm;