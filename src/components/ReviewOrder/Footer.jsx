import React from 'react';
import './Footer.css'

const Footer = () => {
  return (
    <footer style={{
      marginTop: '20px',
      padding: '20px',
      backgroundColor: '#f5f5f5',
      textAlign: 'center',
    }}>
      <ul style={{
        listStyle: 'none',
        padding: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
      }}>
        <li><a href="/support" style={{ color: '#666', textDecoration: 'none', fontSize: '14px' }}>Support</a></li>
        <li><a href="/faq" style={{ color: '#666', textDecoration: 'none', fontSize: '14px' }}>FAQ</a></li>
      </ul>
    </footer>
  );
};

export default Footer;