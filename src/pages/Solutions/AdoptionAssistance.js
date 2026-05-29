import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './AdoptionAssistance.scss';

const AdoptionAssistance = () => {
  const [hoveredPet, setHoveredPet] = useState(null);

  const availablePets = [
    {
      name: 'Buddy',
      breed: 'Golden Retriever',
      age: '2 years',
      desc: 'A playful and loving dog who adores fetch and cuddles.',
    },
    {
      name: 'Luna',
      breed: 'Maine Coon',
      age: '1 year',
      desc: 'A gentle giant with a fluffy coat and a purr that melts hearts.',
    },
    {
      name: 'Max',
      breed: 'Beagle',
      age: '3 years',
      desc: 'An energetic explorer who loves sniffing out new adventures.',
    },
    {
      name: 'Mittens',
      breed: 'Tabby',
      age: '4 months',
      desc: 'A curious kitten ready to bring joy to your home.',
    },
    {
      name: 'Rex',
      breed: 'German Shepherd',
      age: '5 years',
      desc: 'A loyal protector with a heart of gold, seeking a forever family.',
    },
    {
      name: 'Snowball',
      breed: 'Persian',
      age: '2 years',
      desc: 'A serene beauty who loves lounging and being pampered.',
    },
  ];

  const adoptionSteps = [
    {
      step: 'Step 1: Submit Application',
      desc: 'Fill out our online form with your details and preferences.',
    },
    {
      step: 'Step 2: Meet & Greet',
      desc: 'Visit our center to meet your potential new companion.',
    },
    {
      step: 'Step 3: Home Check',
      desc: 'We ensure your home is a safe haven for your pet.',
    },
    {
      step: 'Step 4: Finalize Adoption',
      desc: 'Sign the papers and welcome your pet home!',
    },
  ];

  const successStories = [
    {
      name: 'Sarah & Milo',
      story: '“Milo was shy at first, but now he’s the king of our house! Adoption was the best decision we ever made.”',
    },
    {
      name: 'James & Bella',
      story: '“Bella’s energy lights up our days. The adoption process was smooth, and the team was so supportive.”',
    },
    {
      name: 'Emily & Whiskers',
      story: '“Whiskers curled up on my lap the first day. It’s like she knew she was home. Thank you, Pawfect Care!”',
    },
    {
      name: 'Tom & Rocky',
      story: '“Rocky’s loyalty is unmatched. Adopting him gave us a best friend for life.”',
    },
  ];

  return (
    <div className="adoption-assistance">
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
            Find Your Perfect Companion!
          </motion.h1>
          <motion.button
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            onClick={() => window.scrollTo({ top: document.querySelector('.available-pets').offsetTop, behavior: 'smooth' })}
          >
            View Available Pets
          </motion.button>
        </div>
      </motion.section>

      {/* Available Pets Gallery */}
      <section className="available-pets">
        <h2>Meet Our Adoptable Pets</h2>
        <div className="pets-grid">
          {availablePets.map((pet, index) => (
            <motion.div
              key={index}
              className="pet-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              onMouseEnter={() => setHoveredPet(index)}
              onMouseLeave={() => setHoveredPet(null)}
            >
              <div className="pet-photo" />
              <h3>{pet.name}</h3>
              <p><strong>Breed:</strong> {pet.breed}</p>
              <p><strong>Age:</strong> {pet.age}</p>
              <p>{pet.desc}</p>
              {hoveredPet === index && (
                <motion.button
                  className="learn-more"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  Learn More
                </motion.button>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Adoption Process Steps */}
      <section className="adoption-process">
        <h2>How to Adopt</h2>
        <div className="steps">
          {adoptionSteps.map((step, index) => (
            <motion.div
              key={index}
              className="step-item"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="step-number">{index + 1}</div>
              <h3>{step.step}</h3>
              <p>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Success Stories */}
      <section className="success-stories">
        <h2>Happy Adoption Stories</h2>
        <div className="stories-grid">
          {successStories.map((story, index) => (
            <motion.div
              key={index}
              className="story-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="story-photo" />
              <h3>{story.name}</h3>
              <p>{story.story}</p>
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
        <h2>Ready to Adopt?</h2>
        <p>Start your journey to finding a furry friend today!</p>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.href = '/adoption/apply'}
        >
          Start Adoption
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

export default AdoptionAssistance;