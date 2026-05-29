import React from 'react';
import './OrderReview.css'

const OrderReview = ({ cart, user }) => {
  return (
    <section style={{ margin: '20px 0' }}>
      <h2 style={{ fontSize: '20px', marginBottom: '15px' }}>Order Review & Confirmation</h2>
      <div style={{
        padding: '15px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#fff',
      }}>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {cart.map((item, index) => (
            <li key={index} style={{ marginBottom: '10px' }}>
              ✓ {item.name} - Qty: {item.quantity} - ₹{item.discountPrice}
            </li>
          ))}
          <li style={{ marginBottom: '10px' }}>✓ Shipping to: {user.address || 'Not provided'}</li>
          <li>✓ Contact: {user.email || 'Not provided'}, {user.phone || 'Not provided'}</li>
        </ul>
        <div style={{ marginTop: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input type="checkbox" style={{ marginRight: '10px' }} />
            I agree to the{' '}
            <a href="/terms" style={{ color: '#007bff', textDecoration: 'none' }}
              onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
              onMouseOut={(e) => e.target.style.textDecoration = 'none'}
            >Terms & Conditions</a> and Privacy Policy.
          </label>
        </div>
      </div>
    </section>
  );
};

export default OrderReview;