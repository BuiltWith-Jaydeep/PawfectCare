import React from 'react';
import { motion } from 'framer-motion';
import './BoardingDaycare.scss';

const BoardingDaycare = () => {
  const boardingServices = [
    {
      title: 'Daycare',
      desc: 'Perfect for busy pet parents, our daycare offers supervised play, socialization, and fun activities all day long.',
    },
    {
      title: 'Overnight Boarding',
      desc: 'A cozy and safe place for your pet to stay overnight, with comfortable bedding and round-the-clock care.',
    },
    {
      title: 'Extended Stays',
      desc: 'For longer trips, we provide extended boarding with extra pampering and personalized attention.',
    },
  ];

  const facilityFeatures = [
    'Spacious indoor and outdoor play areas',
    'Climate-controlled sleeping quarters',
    '24/7 supervision and security',
    'Daily exercise and enrichment activities',
    'Veterinary care on call',
    'Webcam access for pet parents',
    'Healthy meals and treats',
    'Grooming services available',
  ];

  return (
    <div className="boarding-daycare">
      {/* Header */}
      <header className="header">
        <img src="/assets/images/logo.png" alt="Pawfect Care Logo" className="logo" />
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/health-management">Health Management</a></li>
            <li><a href="/grooming">Grooming</a></li>
            <li><a href="/adoption">Adoption</a></li>
            <li><a href="/vaccination">Vaccination</a></li>
            <li><a href="/boarding">Boarding</a></li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <motion.section
        className="hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="hero-content">
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Safe & Fun Boarding for Your Pets!
          </motion.h1>
          <motion.button
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            onClick={() => window.scrollTo({ top: document.querySelector('.cta').offsetTop, behavior: 'smooth' })}
          >
            Reserve Now
          </motion.button>
        </div>
      </motion.section>

      {/* Boarding Services Overview */}
      <section className="services-overview">
        <h2>Our Boarding Services</h2>
        <div className="services-grid">
          {boardingServices.map((service, index) => (
            <motion.div
              key={index}
              className="service-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Facility Features */}
      <section className="facility-features">
        <h2>Why Choose Us?</h2>
        <ul>
          {facilityFeatures.map((feature, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <span className="icon">✓</span> {feature}
            </motion.li>
          ))}
        </ul>
      </section>

      {/* Booking Information */}
      <section className="booking-info">
        <h2>How to Book</h2>
        <p>Booking is easy! Follow these steps to reserve a spot for your pet:</p>
        <ol>
          <li>Call us at (123) 456-7890 or email info@pawfectcare.com.</li>
          <li>Provide your pet’s details and preferred dates.</li>
          <li>Confirm availability and make a deposit if required.</li>
          <li>Drop off your pet and relax knowing they’re in good hands!</li>
        </ol>
        <p>For more information, visit our <a href="/boarding">Boarding Page</a> or contact us directly.</p>
      </section>

      {/* Call-to-Action */}
      <motion.section
        className="cta"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2>Reserve Your Pet’s Spot Today!</h2>
        <p>Give your pet a vacation they’ll love while you’re away.</p>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.href = '/boarding/book'}
        >
          Reserve Now
        </motion.button>
      </motion.section>

      {/* Footer */}
      <footer className="footer">
        <div className="social-media">
          <a href="#">Facebook</a>
          <a href="#">Instagram</a>
          <a href="#">Twitter</a>
        </div>
        <div className="contact">
          <p>Contact us: info@pawfectcare.com | (123) 456-7890</p>
        </div>
        <div className="quick-links">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="/contact">Contact Us</a>
        </div>
      </footer>
    </div>
  );
};

export default BoardingDaycare;