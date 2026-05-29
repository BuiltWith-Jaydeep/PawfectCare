import React from 'react';
import { motion } from 'framer-motion';
import styles from '../styles/AdminPanel.module.css';

function AdminIntroAnimation({ onAnimationComplete }) {
  const text = "Welcome to PawfectCare Admin Panel";
  const letters = text.split("");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.5 } },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05 },
    }),
  };

  const subtitleVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { delay: letters.length * 0.05 + 0.5, duration: 0.5 } },
  };

  return (
    <motion.div
      className={styles.adminIntro}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.h1>
        {letters.map((letter, index) => (
          <motion.span
            key={index}
            custom={index}
            variants={letterVariants}
            initial="hidden"
            animate="visible"
          >
            {letter}
          </motion.span>
        ))}
      </motion.h1>
      <motion.h2
        variants={subtitleVariants}
        initial="hidden"
        animate="visible"
        onAnimationComplete={onAnimationComplete}
      >
        PawfectCare - Admin
      </motion.h2>
    </motion.div>
  );
}

export default AdminIntroAnimation;