import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTachometerAlt, FaUsers, FaShoppingCart, FaConciergeBell } from 'react-icons/fa';
import styles from '../styles/AdminPanel.module.css';

function Sidebar() {
  const links = [
    { to: "/admin", icon: <FaTachometerAlt />, text: "Dashboard" },
    { to: "/admin/users", icon: <FaUsers />, text: "Users" },
    { to: "/admin/orders", icon: <FaShoppingCart />, text: "Orders" },
    { to: "/admin/services", icon: <FaConciergeBell />, text: "Services" },
  ];

  const sidebarVariants = {
    hidden: { x: -200 },
    visible: { x: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.2, duration: 0.3 },
    }),
  };

  return (
    <motion.aside
      className={styles.sidebar}
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
    >
      <ul>
        {links.map((link, index) => (
          <motion.li
            key={index}
            custom={index}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.05 }}
          >
            <NavLink
              to={link.to}
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              {link.icon}
              <span>{link.text}</span>
            </NavLink>
          </motion.li>
        ))}
      </ul>
    </motion.aside>
  );
}

export default Sidebar;