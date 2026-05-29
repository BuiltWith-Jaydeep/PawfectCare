import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './GroomingCare.scss';

const GroomingCare = () => {
  const [activeTip, setActiveTip] = useState(null);

  const groomingServices = [
    {
      title: 'Bathing & Brushing',
      desc: 'A thorough bath with premium shampoo and a gentle brush to keep fur shiny and tangle-free.',
      price: '$25 - $45',
    },
    {
      title: 'Haircuts & Styling',
      desc: 'Custom cuts to suit your pet’s breed and your preferences, leaving them looking pawsitively stylish.',
      price: '$35 - $60',
    },
    {
      title: 'Nail Trimming',
      desc: 'Safe and quick nail trimming to prevent overgrowth and discomfort for your furry friend.',
      price: '$15 - $25',
    },
    {
      title: 'Ear Cleaning',
      desc: 'Gentle cleaning to remove dirt and wax, keeping your pet’s ears healthy and infection-free.',
      price: '$10 - $20',
    },
    {
      title: 'Teeth Brushing',
      desc: 'A dental refresh with pet-safe toothpaste to maintain oral hygiene and fresh breath.',
      price: '$15 - $30',
    },
  ];

  const beforeAfterData = [
    { id: 1, title: 'Fluffy’s Transformation', desc: 'From matted to marvelous!' },
    { id: 2, title: 'Max’s Makeover', desc: 'A sleek new look!' },
    { id: 3, title: 'Luna’s Glow-Up', desc: 'Shining brighter than ever!' },
    { id: 4, title: 'Rex’s Refresh', desc: 'Ready for the park!' },
  ];

  const groomingTips = [
    {
      title: 'Brush Regularly',
      content: 'Brush your pet’s coat 2-3 times a week to remove loose hair, prevent mats, and distribute natural oils for a healthy shine. Use a brush suited to their fur type—slicker brushes for long coats, bristle brushes for short ones.',
    },
    {
      title: 'Bathe Sparingly',
      content: 'Bathe your pet every 4-6 weeks unless they’re visibly dirty. Over-bathing can strip natural oils, leading to dry skin. Use pet-specific shampoos—human products can irritate their skin.',
    },
    {
      title: 'Trim Nails Monthly',
      content: 'Check nails monthly and trim if they click on the floor. Use a pet nail clipper and avoid the quick (the pink part). If unsure, consult a groomer to avoid stress or injury.',
    },
    {
      title: 'Clean Ears Weekly',
      content: 'Wipe your pet’s ears with a damp cotton ball or vet-approved solution weekly. Avoid Q-tips—they can push debris deeper. Look for redness or odor, which might signal an infection.',
    },
    {
      title: 'Brush Teeth Often',
      content: 'Brush your pet’s teeth 2-3 times a week with pet-safe toothpaste. Start slow to get them comfortable, and reward them after. It prevents plaque buildup and bad breath.',
    },
    {
      title: 'Check for Fleas',
      content: 'Inspect your pet’s coat weekly for fleas or ticks, especially after outdoor time. Use a fine-tooth comb and consult a vet for preventatives if needed.',
    },
    {
      title: 'Reward Grooming',
      content: 'Make grooming a positive experience with treats and praise. Start young to build a routine they’ll enjoy, reducing stress for both of you.',
    },
    {
      title: 'Avoid Harsh Tools',
      content: 'Don’t use scissors near the skin unless trained—clippers are safer. Dull tools can pull hair, so keep them sharp and clean for a smooth groom.',
    },
    {
      title: 'Dry Thoroughly',
      content: 'After baths, dry your pet completely with a towel or low-heat dryer. Wet fur can lead to skin irritation or fungal growth, especially in thick coats.',
    },
    {
      title: 'Know Your Breed',
      content: 'Research your pet’s grooming needs—some breeds need frequent trims (e.g., Poodles), while others shed heavily (e.g., Huskies). Tailor your approach accordingly.',
    },
  ];

  return (
    <div className="grooming-care">
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
            Pamper Your Pet with Our Grooming Services!
          </motion.h1>
          <motion.button
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            onClick={() => window.scrollTo({ top: document.querySelector('.cta').offsetTop, behavior: 'smooth' })}
          >
            Book Now
          </motion.button>
        </div>
      </motion.section>

      {/* Grooming Services Overview */}
      <section className="services-overview">
        <h2>Our Grooming Services</h2>
        <div className="services-grid">
          {groomingServices.map((service, index) => (
            <motion.div
              key={index}
              className="service-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="service-icon" />
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
              <span className="price">{service.price}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Before & After Gallery */}
      <section className="before-after">
        <h2>Before & After Gallery</h2>
        <div className="gallery">
          {beforeAfterData.map((item, index) => (
            <motion.div
              key={item.id}
              className="gallery-item"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.1 }}
            >
              <div className="before" />
              <div className="after" />
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Grooming Tips */}
      <section className="grooming-tips">
        <h2>Grooming Tips</h2>
        <div className="accordion">
          {groomingTips.map((tip, index) => (
            <motion.div
              key={index}
              className="tip-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div
                className="tip-header"
                onClick={() => setActiveTip(activeTip === index ? null : index)}
              >
                <h3>{tip.title}</h3>
                <span className={`arrow ${activeTip === index ? 'open' : ''}`} />
              </div>
              {activeTip === index && (
                <motion.div
                  className="tip-content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p>{tip.content}</p>
                </motion.div>
              )}
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
        <h2>Book Your Grooming Session Today!</h2>
        <p>Give your pet the spa day they deserve with our expert groomers.</p>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.href = '/grooming/book'}
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

export default GroomingCare;