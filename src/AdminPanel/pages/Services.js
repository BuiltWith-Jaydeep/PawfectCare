import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import Consultation from './Consultation';
import Grooming from './Grooming';
import Adoption from './Adoption';
import Daycare from './Daycare';
import Vaccination from './Vaccination';
import styles from '../styles/AdminPanel.module.css';

function Services() {
  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className={styles.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1>Services Management</h1>
      <motion.nav
        className={styles.serviceNav}
        variants={navVariants}
        initial="hidden"
        animate="visible"
      >
        {[
          { to: 'consultation', text: 'Consultation' },
          { to: 'grooming', text: 'Grooming' },
          { to: 'adoption', text: 'Adoption' },
          { to: 'daycare', text: 'Daycare' },
          { to: 'vaccination', text: 'Vaccination' },
        ].map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            whileHover={{ scale: 1.1 }}
          >
            {link.text}
          </NavLink>
        ))}
      </motion.nav>
      <div className={styles.serviceContent}>
        <Routes>
          <Route path="consultation" element={<Consultation />} />
          <Route path="grooming" element={<Grooming />} />
          <Route path="adoption" element={<Adoption />} />
          <Route path="daycare" element={<Daycare />} />
          <Route path="vaccination" element={<Vaccination />} />
          <Route path="/" element={<div className={styles.placeholder}>Select a service to manage</div>} />
        </Routes>
      </div>
    </motion.div>
  );
}

export default Services;