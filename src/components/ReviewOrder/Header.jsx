import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../Header/assets/logo.png';
import './Header.css'

const Header = () => {
  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px',
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }}>
      {/* Logo & Branding */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={logo} alt="PawfectCare Logo" style={{ width: '50px', marginRight: '15px' }} />
        <h1 style={{
          fontFamily: 'Arial, sans-serif',
          fontSize: '24px',
          margin: 0,
          color: '#333',
        }}>PawfectCare</h1>
      </div>

      {/* Navigation */}
      <nav>
        <ul style={{ display: 'flex', listStyle: 'none', gap: '20px', margin: 0 }}>
          <li><Link to="/" style={{ textDecoration: 'none', color: '#007bff' }}>Home</Link></li>
          <li><Link to="/shop" style={{ textDecoration: 'none', color: '#007bff' }}>Shop</Link></li>
          <li><Link to="/checkout" style={{ textDecoration: 'none', color: '#007bff' }}>Checkout</Link></li>
        </ul>
      </nav>

      {/* Progress Indicator */}
      <div style={{ fontSize: '14px', color: '#666' }}>
        <span style={{ color: '#007bff' }}>Cart</span> &gt; 
        <span style={{ color: '#007bff' }}>Review Order</span> &gt; 
        <span>Payment</span>
      </div>
    </header>
  );
};

export default Header;