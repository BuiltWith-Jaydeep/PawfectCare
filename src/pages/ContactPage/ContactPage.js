import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom'; // Added useNavigate
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUser, faEnvelope, faComment } from '@fortawesome/free-solid-svg-icons';
import styles from './ContactPage.module.scss';
import Logo from '../../components/Header/assets/logo.png';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    document.title = 'Contact Us | PawfectCare';
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
      setErrors({});
    }, 2000);
  };

  // Navigation handler
  const handleBackToHome = () => {
    navigate('/'); // Programmatic navigation to home
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.hero}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <img src={Logo} alt="PawfectCare Logo" className={styles.logo} />
        <h1>Your Pet's Health is Our Priority</h1>
        <p>Reach out to us—we’re always here to help your furry friends!</p>
        <motion.div
          className={styles.backToHome}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Option 1: Link (kept as fallback) */}
          {/* <Link to="/" aria-label="Back to Home"> */}
          {/* Option 2: Button with useNavigate */}
          <button onClick={handleBackToHome} aria-label="Back to Home">
            <FontAwesomeIcon icon={faArrowLeft} /> Back to Home
          </button>
        </motion.div>
      </motion.div>

      <motion.div
        className={styles.content}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className={styles.formContainer} variants={itemVariants}>
          <h2>Send us a Message</h2>
          <form onSubmit={handleSubmit}>
            <motion.div variants={itemVariants} className={styles.formGroup}>
              <FontAwesomeIcon icon={faUser} className={styles.icon} />
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <label htmlFor="name">Full Name</label>
              {errors.name && <span className={styles.error}>{errors.name}</span>}
            </motion.div>

            <motion.div variants={itemVariants} className={styles.formGroup}>
              <FontAwesomeIcon icon={faEnvelope} className={styles.icon} />
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <label htmlFor="email">Email Address</label>
              {errors.email && <span className={styles.error}>{errors.email}</span>}
            </motion.div>

            <motion.div variants={itemVariants} className={styles.formGroup}>
              <FontAwesomeIcon icon={faComment} className={styles.icon} />
              <textarea
                id="message"
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
              <label htmlFor="message"></label>
              {errors.message && <span className={styles.error}>{errors.message}</span>}
            </motion.div>

            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Message'}
              {isLoading && <div className={styles.spinner}></div>}
            </button>
          </form>
        </motion.div>

        <motion.div className={styles.infoContainer} variants={itemVariants}>
          <div className={styles.infoCard}>
            <h3>Get in Touch</h3>
            <motion.div variants={itemVariants} className={styles.contactItem}>
              <i className="fas fa-phone"></i>
              <div>
                <h4>Emergency Hotline</h4>
                <p>+91 9313279435</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className={styles.contactItem}>
              <i className="fas fa-envelope"></i>
              <div>
                <h4>Email Us</h4>
                <p>user@example.com</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className={styles.contactItem}>
              <i className="fas fa-map-marker-alt"></i>
              <div>
                <h4>Visit Us</h4>
                <p>MaMo Technolab LLP<br />Baroda - 390011</p>
              </div>
            </motion.div>

            <div className={styles.mapContainer}>
              <iframe
                title="location-map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d118147.70084039235!2d73.08055229999999!3d22.322358799999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395fc8ab7a3d50e3%3A0x1f8e008bcc5d3451!2sVadodara%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1716561593213!5m2!1sen!2sin"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ContactPage;