import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './PetHealthManagement.scss';

const PetHealthManagement = () => {
  const [hoveredStat, setHoveredStat] = useState(null);

  const tipsDos = [
    'Provide fresh water daily to keep your pet hydrated.',
    'Schedule regular vet checkups every 6-12 months.',
    'Feed a balanced diet tailored to your pet’s needs.',
    'Ensure daily exercise to maintain physical health.',
    'Socialize your pet with others for mental well-being.',
    'Brush their teeth weekly to prevent dental issues.',
    'Keep their living area clean and comfortable.',
    'Monitor weight to avoid obesity.',
    'Use parasite preventatives as recommended.',
    'Offer mental stimulation with toys and puzzles.',
  ];

  const tipsDonts = [
    'Don’t feed chocolate, grapes, or toxic foods.',
    'Don’t leave pets in hot cars, even briefly.',
    'Don’t use human medications without vet approval.',
    'Don’t ignore signs of illness like lethargy or vomiting.',
    'Don’t overfeed treats, which can lead to weight gain.',
    'Don’t skip vaccinations or booster shots.',
    'Don’t expose pets to harsh chemicals or cleaners.',
    'Don’t neglect grooming, which can cause skin issues.',
    'Don’t punish pets for natural behaviors.',
    'Don’t leave choke hazards like small toys around.',
  ];

  const stats = [
    { title: 'Vaccination Rate', value: '75%', desc: 'Of pets are up to date on vaccinations.' },
    { title: 'Obesity Rate', value: '1 in 3', desc: 'Pets face obesity issues.' },
    { title: 'Dental Disease', value: '80%', desc: 'Of pets over 3 years have dental problems.' },
    { title: 'Parasite Prevention', value: '60%', desc: 'Of owners use preventatives regularly.' },
  ];

  const resources = [
    { title: 'How to Keep Your Pet Healthy', desc: 'Comprehensive tips for pet wellness.' },
    { title: 'Understanding Pet Nutrition', desc: 'Guide to choosing the right diet.' },
    { title: 'Common Pet Illnesses', desc: 'Symptoms to watch for and when to act.' },
    { title: 'Exercise Routines for Pets', desc: 'Fun ways to keep your pet active.' },
    { title: 'Mental Stimulation Ideas', desc: 'Activities to boost your pet’s mind.' },
    { title: 'Preventing Parasites', desc: 'How to protect your pet year-round.' },
  ];

  return (
    <div className="pet-health-management">
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
            Empower Your Pet’s Health!
          </motion.h1>
          <motion.button
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            onClick={() => window.scrollTo({ top: document.querySelector('.tips-guidelines').offsetTop, behavior: 'smooth' })}
          >
            Get Started
          </motion.button>
        </div>
      </motion.section>

      {/* Tips & Guidelines */}
      <section className="tips-guidelines">
        <h2>Tips & Guidelines</h2>
        <div className="columns">
          <motion.div
            className="column dos"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3>Do’s</h3>
            <ul>
              {tipsDos.map((tip, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <span className="icon">✓</span> {tip}
                </motion.li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            className="column donts"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3>Don’ts</h3>
            <ul>
              {tipsDonts.map((tip, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <span className="icon">✗</span> {tip}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Interactive Infographic */}
      <section className="infographic">
        <h2>Pet Health Statistics</h2>
        <div className="stats">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="statistic"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              onMouseEnter={() => setHoveredStat(index)}
              onMouseLeave={() => setHoveredStat(null)}
            >
              <h4>{stat.title}</h4>
              <p className="value">{stat.value}</p>
              {hoveredStat === index && (
                <motion.p
                  className="description"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {stat.desc}
                </motion.p>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pet Health Resources */}
      <section className="resources">
        <h2>Pet Health Resources</h2>
        <div className="grid">
          {resources.map((resource, index) => (
            <motion.div
              key={index}
              className="resource-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="thumbnail" />
              <h3>{resource.title}</h3>
              <p>{resource.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call-to-Action */}
      <motion.section
        className="cta"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2>Schedule a Veterinary Consultation</h2>
        <p>Ensure your pet’s health with our expert veterinarians.</p>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.href = '/consultation'}
        >
          Book Now
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

export default PetHealthManagement;