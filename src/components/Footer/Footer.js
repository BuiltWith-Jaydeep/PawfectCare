import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const footerLinks = [
    {
      title: 'Quick Links',
      items: [
        { name: 'Home', link: '/' },
        { name: 'Services', link: '/services' },
        { name: 'About', link: '/terms-and-conditions' },
        { name: 'Contact', link: '/contact' }
      ]
    },
    {
      title: 'Legal',
      items: [
        { name: 'Privacy Policy', link: '/terms-and-conditions' },
        { name: 'Terms of Service', link: '/terms-and-conditions' },
        { name: 'Cookie Policy', link: '/terms-and-conditions' }
      ]
    },
    {
      title: 'Social',
      items: [
        { name: 'X', link: 'https://x.com/PawfectCare_' },
        { name: 'Facebook', link: 'https://www.facebook.com/' },
        { name: 'Instagram', link: 'https://www.instagram.com/pawfect.care_247?igsh=YWtlM2FleGo3OTlm' },
        { name: 'LinkedIn', link: 'https://www.linkedin.com/in/prajapati-jayadip-886a21324?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app' }
      ]
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
        {/* Contact us */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="footer-section"
        >
          <h3 className="footer-heading">Contact Us</h3>
          <p>
            📞{' '}
            <Link to="/contact">
              <a href="tel:+919725934848" onClick={(e) => e.stopPropagation()}>
                +91 9725934848
              </a>
            </Link>
          </p>
          <p>
            📧{' '}
            <a href="mailto:hello@pawfectcare.com">
              hello@pawfectcare.com
            </a>
          </p>
          <p>
            📍{' '}
            <a 
              href="https://www.google.com/maps/dir/22.5050624,73.4593024/Dr.Sisodiya's+Veterinary+Clinic,+New+Kumbharwada,+Bhatia+Bazar+Old,+Porbandar,+Gujarat+360575/@22.1302944,70.2180864,8z/data=!3m1!4b1!4m9!4m8!1m1!4e1!1m5!1m1!1s0x3956344e7a1a44ed:0xe9a7d9b01ca1d841!2m2!1d69.607261!2d21.645762?entry=ttu&g_ep=EgoyMDI1MDMyNC4wIKXMDSoASAFQAw%3D%3D" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              123 Pet Care Street, Baroda
            </a>
          </p>
        </motion.div>

        {/* Footer ni Links */}
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
                  key={item.name}
                  whileHover={{ x: 5 }}
                >
                  {item.link.startsWith('http') ? (
                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                      {item.name}
                    </a>
                  ) : (
                    <Link to={item.link}>
                      {item.name}
                    </Link>
                  )}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}

        {/* paper */}
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

      {/* Amation subtract */}
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