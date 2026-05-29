import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import logo from './assets/logo.png';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);
  const logoutTimerRef = useRef(null);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Shop', path: '/shop' },
    { name: 'Contact', path: '/contact' }
  ];

  // Show logout button when hovering
  const handleMouseEnter = () => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
    setShowLogout(true);
  };

  // Hide after 2 seconds
  const handleMouseLeave = () => {
    logoutTimerRef.current = setTimeout(() => {
      setShowLogout(false);
    }, 2000);
  };

  // Navigate to My Account page 
  const handleAccountClick = () => {
    navigate('/my-account');
  };

  // Log out and redirect to login
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="main-header"
    >
      <div className="header-content">
        {/* Website Logo */}
        <motion.div whileHover={{ scale: 1.05 }} className="logo-container">
          <Link to="/" className="logo-link">
            <img src={logo} alt="Pawfect Care Logo" className="header-logo" />
            <span className="logo-text"></span>
          </Link>
        </motion.div>

        {/* nav Links */}
        <nav className="nav-menu">
          {navLinks.map((link, index) => (
            <motion.div
              key={link.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.5 }}
            >
              <Link to={link.path} className="nav-link">
                {link.name}
                <motion.div
                  className="link-underline"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                />
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="auth-buttons">
          {isAuthenticated ? (
            <div
              className="my-account-container"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{ position: 'relative', display: 'inline-block' }}
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="my-account-button"
                onClick={handleAccountClick}
              >
                My Account
              </motion.button>
              {showLogout && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="logout-button"
                  onClick={handleLogout}
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                  }}
                >
                  Log Out
                </motion.button>
              )}
            </div>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="login-button"
                onClick={() => navigate('/login')}
              >
                Log In
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="signup-button"
                onClick={() => navigate('/signup')}
              >
                Sign Up
              </motion.button>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;