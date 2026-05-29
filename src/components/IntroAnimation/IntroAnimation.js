import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import mascot from './assets/mascot.svg';
import pawPrint from './assets/paw-print.svg';
import './IntroAnimation.scss';

const IntroAnimation = ({ onAnimationComplete }) => {
  const logoText = "PawfectCare";

  useEffect(() => {
    const sequence = async () => {
      
      await new Promise((resolve) => setTimeout(resolve, 3500));
      onAnimationComplete(); // Trigger redirect to home page
    };
    sequence();
  }, [onAnimationComplete]);

  return (
    <div className="intro-animation">
      {/* Pulse Line with Glow Effect */}
      <motion.svg className="pulse-line" viewBox="0 0 100 20">
        <motion.path
          d="M0 10 L20 10 L25 5 L30 15 L35 10 L50 10 L55 5 L60 15 L65 10 L80 10 L100 10"
          stroke="#4a90e2"
          strokeWidth="4"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.3 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
        <motion.path
          d="M0 10 L20 10 L25 5 L30 15 L35 10 L50 10 L55 5 L60 15 L65 10 L80 10 L100 10"
          stroke="#4a90e2"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </motion.svg>

      {/* Content Container for Mascot and Logo */}
      <div className="content">
        <motion.img
          src={mascot}
          className="mascot"
          initial={{ x: '-100vw' }}
          animate={{ x: 0 }}
          transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
        />
        <div className="intro-logo">
          {logoText.split('').map((letter, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.1, duration: 0.5, ease: "easeOut" }}
            >
              {letter}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Paw Print */}
      <motion.img
        src={pawPrint}
        className="paw-print"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
};

export default IntroAnimation;