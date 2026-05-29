import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../Header/assets/logo.png'; 
import { useAuth } from '../../context/AuthContext'; 

const TopNav = () => {
  const navigate = useNavigate();
  const { logout } = useAuth(); 

  const handleLogout = () => {
    logout(); // Clear auth state token, user data
    navigate('/login'); // Redirect to login page
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <img src={logo} alt="PawfectCare Logo" style={styles.logo} />
        <span style={styles.brandName}>PawfectCare</span>
      </div>
      <div style={styles.right}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/terms-and-conditions" style={styles.link}>Help</Link>
        <button style={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    padding: '15px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1000,
  },
  left: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    width: '80px',
    height: '40px',
    marginRight: '15px',
    objectFit: 'contain',
  },
  brandName: {
    fontFamily: "'Pacifico', cursive",
    fontSize: '28px',
    color: '#14B8A6',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '25px',
  },
  link: {
    textDecoration: 'none',
    color: '#333',
    fontSize: '16px',
    fontWeight: 600,
    transition: 'color 0.3s',
  },
  logoutButton: {
    backgroundColor: '#e63946',
    color: '#fff',
    border: 'none',
    padding: '8px 20px',
    borderRadius: '25px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 600,
    transition: 'background-color 0.3s',
  },
};

export default TopNav;