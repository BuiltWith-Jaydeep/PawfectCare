import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './PaymentSuccess.css';
import client from '../api/client';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Extract session_id from URL
    const sessionId = new URLSearchParams(window.location.search).get('session_id');

    if (sessionId) {
      // Call the backend to confirm payment and save order
      client.get(`/api/payment/confirm?session_id=${sessionId}`)
        .then(res => console.log('Order save response:', res.data))
        .catch(err => console.error('Error saving order:', err));
    }

    // Redirect to home after 5 seconds
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.5,
      },
    },
    exit: { opacity: 0, transition: { duration: 0.5 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const pawVariants = {
    bounce: {
      y: [0, -20, 0],
      rotate: [0, 10, -10, 0],
      transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
    },
  };

  return (
    <motion.div
      className="payment-success-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Background Gradient */}
      <div className="gradient-bg"></div>

      {/* Confetti Particles (simulated with CSS) */}
      <div className="confetti"></div>

      {/* Main Content */}
      <motion.h1 variants={itemVariants}>Payment Successful!</motion.h1>
      <motion.p variants={itemVariants}>
        Thank you for your purchase, paw-some human! Your goodies are on the way!
      </motion.p>

      {/* Animated Paw Icon */}
      <motion.div
        className="paw-icon"
        variants={pawVariants}
        animate="bounce"
      >
        🐾
      </motion.div>

      {/* Redirect Message */}
      <motion.p variants={itemVariants} className="redirect-text">
        Redirecting you to the home page in 5 seconds...{' '}
        <a href="/" className="home-link">Click here</a> if you can’t wait!
      </motion.p>

      {/* Progress Bar */}
      <motion.div
        className="progress-bar"
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: 5, ease: 'linear' }}
      ></motion.div>
    </motion.div>
  );
};

export default PaymentSuccess;