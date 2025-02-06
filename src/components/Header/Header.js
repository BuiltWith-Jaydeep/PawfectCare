import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="main-header"
    >
      <div className="header-content">
        {/* Logo with animation */}
        <motion.div whileHover={{ scale: 1.05 }} className="logo-container">
          <Link to="/" className="logo-link">
            <img src="/assets/logo.svg" alt="Pawfect Care Logo" className="logo" />
            <span className="logo-text">Pawfect Care</span>
          </Link>
        </motion.div>

        {/* Navigation Links */}
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

        {/* Authentication Buttons */}
        <div className="auth-buttons">
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
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
