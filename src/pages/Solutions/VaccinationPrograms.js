import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './VaccinationPrograms.scss';

const VaccinationPrograms = () => {
  const [activeFAQ, setActiveFAQ] = useState(null);

  const vaccinationSchedule = [
    {
      type: 'Dogs',
      vaccines: [
        { age: '6-8 weeks', vaccines: 'Distemper, Parvovirus' },
        { age: '10-12 weeks', vaccines: 'DHPP (Distemper, Hepatitis, Parvovirus, Parainfluenza)' },
        { age: '14-16 weeks', vaccines: 'DHPP, Rabies' },
        { age: 'Annually', vaccines: 'DHPP booster, Rabies (if required)' },
      ],
    },
    {
      type: 'Cats',
      vaccines: [
        { age: '6-8 weeks', vaccines: 'FVRCP (Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia)' },
        { age: '10-12 weeks', vaccines: 'FVRCP booster' },
        { age: '14-16 weeks', vaccines: 'FVRCP booster, Rabies' },
        { age: 'Annually', vaccines: 'FVRCP booster, Rabies (if required)' },
      ],
    },
  ];

  const commonVaccines = [
    {
      name: 'Rabies',
      desc: 'Protects against the deadly rabies virus, which can be transmitted to humans. Required by law in many areas.',
      importance: 'Critical for public health and pet safety.',
    },
    {
      name: 'Distemper',
      desc: 'Prevents canine distemper, a highly contagious and often fatal disease affecting multiple organs.',
      importance: 'Essential for all dogs, especially puppies.',
    },
    {
      name: 'Parvovirus',
      desc: 'Guards against parvovirus, which causes severe gastrointestinal illness and can be fatal, especially in young dogs.',
      importance: 'Crucial for puppies and unvaccinated adults.',
    },
    {
      name: 'FVRCP (Cats)',
      desc: 'Protects against three common feline viruses: rhinotracheitis, calicivirus, and panleukopenia.',
      importance: 'Core vaccine for all cats, especially kittens.',
    },
    {
      name: 'Leptospirosis',
      desc: 'Prevents leptospirosis, a bacterial infection that can cause kidney and liver failure in dogs and humans.',
      importance: 'Recommended for dogs in high-risk areas.',
    },
  ];

  const faqs = [
    {
      question: 'Are vaccinations safe for my pet?',
      answer: 'Yes, vaccines are rigorously tested and safe for most pets. Side effects are rare and usually mild, like slight lethargy or soreness.',
    },
    {
      question: 'How often should my pet be vaccinated?',
      answer: 'Puppies and kittens need a series of vaccines, followed by boosters. Adults typically need annual or triennial boosters, depending on the vaccine.',
    },
    {
      question: 'Can my pet get sick from a vaccine?',
      answer: 'It’s very rare. Vaccines may cause mild reactions, but serious issues are uncommon. Always monitor your pet after vaccination and consult your vet if concerned.',
    },
    {
      question: 'What if I miss a vaccination deadline?',
      answer: 'Contact your vet to reschedule. Delays can leave your pet vulnerable, but your vet will help you get back on track safely.',
    },
    {
      question: 'Are there any side effects I should watch for?',
      answer: 'Common side effects include mild fever, lethargy, or swelling at the injection site. Severe reactions are rare but require immediate vet attention.',
    },
    {
      question: 'Do indoor pets need vaccinations?',
      answer: 'Yes, even indoor pets can be exposed to diseases through air, clothing, or other pets. Core vaccines are recommended for all pets.',
    },
  ];

  return (
    <div className="vaccination-programs">
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
            Keep Your Pets Healthy!
          </motion.h1>
          <motion.button
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            onClick={() => window.scrollTo({ top: document.querySelector('.vaccination-schedule').offsetTop, behavior: 'smooth' })}
          >
            Learn About Vaccines
          </motion.button>
        </div>
      </motion.section>

      {/* Vaccination Schedule */}
      <section className="vaccination-schedule">
        <h2>Vaccination Schedule</h2>
        <div className="schedule-tabs">
          {vaccinationSchedule.map((petType, index) => (
            <motion.div
              key={index}
              className="schedule-tab"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <h3>{petType.type}</h3>
              <ul>
                {petType.vaccines.map((vaccine, idx) => (
                  <li key={idx}>
                    <strong>{vaccine.age}:</strong> {vaccine.vaccines}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Common Vaccines Explained */}
      <section className="common-vaccines">
        <h2>Common Vaccines Explained</h2>
        <div className="vaccines-grid">
          {commonVaccines.map((vaccine, index) => (
            <motion.div
              key={index}
              className="vaccine-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <h3>{vaccine.name}</h3>
              <p>{vaccine.desc}</p>
              <span className="importance">{vaccine.importance}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQs Section */}
      <section className="faqs">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-accordion">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="faq-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div
                className="faq-question"
                onClick={() => setActiveFAQ(activeFAQ === index ? null : index)}
              >
                <h3>{faq.question}</h3>
                <span className={`arrow ${activeFAQ === index ? 'open' : ''}`} />
              </div>
              {activeFAQ === index && (
                <motion.div
                  className="faq-answer"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p>{faq.answer}</p>
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
        <h2>Schedule a Vaccination</h2>
        <p>Protect your pet with our comprehensive vaccination programs.</p>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.href = '/vaccination/book'}
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

export default VaccinationPrograms;