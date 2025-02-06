import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const footerLinks = [
    {
      title: 'Quick Links',
      items: ['Home', 'Services', 'About', 'Contact']
    },
    {
      title: 'Legal',
      items: ['Privacy Policy', 'Terms of Service', 'Cookie Policy']
    },
    {
      title: 'Social',
      items: ['Facebook', 'Instagram', 'Twitter', 'LinkedIn']
    }
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="main-footer"
    >
      <div className="footer-content">
        {/* Contact Info */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="footer-section"
        >
          <h3 className="footer-heading">Contact Us</h3>
          <p>📞 +91 9725934848</p>
          <p>📧 hello@pawfectcare.com</p>
          <p>📍 123 Pet Care Street, Baroda</p>
        </motion.div>

        {/* Footer Links */}
        {footerLinks.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.2 + 0.2 }}
            className="footer-section"
          >
            <h3 className="footer-heading">{section.title}</h3>
            <ul className="footer-links">
              {section.items.map((item) => (
                <motion.li
                  key={item}
                  whileHover={{ x: 5 }}
                >
                  <Link to={`/${item.toLowerCase().replace(' ', '-')}`}>
                    {item}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}

        {/* Newsletter */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="footer-section"
        >
          <h3 className="footer-heading">Newsletter</h3>
          <form className="newsletter-form">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="newsletter-input"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="newsletter-button"
            >
              Subscribe
            </motion.button>
          </form>
        </motion.div>
      </div>

      {/* Copyright */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="copyright"
      >
        © {new Date().getFullYear()} Pawfect Care. All rights reserved.
      </motion.div>

      {/* Animated Divider */}
      <motion.div 
        className="footer-divider"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1 }}
      />
    </motion.footer>
  );
};

export default Footer;