import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useLocation, useNavigate } from 'react-router-dom';
import client from '../../api/client';

// Load Stripe 
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const CallToAction = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Get cart from location state from shoppage.jsx 
  const cart = location.state?.cart || [];

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setError('Your cart is empty. Add items to proceed.');
      return;
    }

    // Log for debug
    console.log('Cart before sending to backend:', cart);

    // Ensure every cart item has name, discountPrice, and quantity
    const formattedCart = cart.map(item => ({
      name: item.name,
      discountPrice: item.discountPrice,
      quantity: item.quantity || 1, 
    }));

    setIsProcessing(true);
    setError(null);

    try {
      // Send formatted cart to backend to create Stripe session
      const response = await client.post('/api/payment/create-checkout-session', { cart: formattedCart });


      const { sessionId } = response.data;

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        throw new Error(error.message);
      }
    } catch (err) {
      console.error('Error during checkout:', err);
      setError('Something went wrong. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <section style={{ margin: '20px 0', textAlign: 'center' }}>
      {/* Order Notes */}
      <textarea
        placeholder="Any special instructions?"
        style={{
          width: '100%',
          maxWidth: '500px',
          padding: '10px',
          borderRadius: '5px',
          border: '1px solid #ccc',
          marginBottom: '20px',
          minHeight: '100px',
        }}
      ></textarea>

      {/* Confirm & Pay Button */}
      <button
        style={{
          padding: '15px 40px',
          backgroundColor: isProcessing ? '#ccc' : '#28a745',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '18px',
          cursor: isProcessing ? 'not-allowed' : 'pointer',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }}
        onClick={handleCheckout}
        disabled={isProcessing || cart.length === 0}
        onMouseOver={(e) => !isProcessing && (e.target.style.backgroundColor = '#218838')}
        onMouseOut={(e) => !isProcessing && (e.target.style.backgroundColor = '#28a745')}
      >
        {isProcessing ? 'Processing...' : 'Confirm & Pay'}
      </button>

      {/* Error Message */}
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </section>
  );
};

export default CallToAction;