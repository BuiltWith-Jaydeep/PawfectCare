import React from "react";
import { motion } from "framer-motion";
import { FaPaw, FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./HeroSection.css";

// Custom variant for the paw animation
const pawVariant = {
  initial: { opacity: 0, y: 0 },
  animate: (i) => ({
    opacity: [0, 1, 1, 1, 0], // Fade in and out
    y: [0, -20, 20, -20, 0], // Zigzag motion
    x: [0, 100, 200, 300, 400], // Move horizontally
    transition: {
      duration: 4, // Total duration of the animation
      ease: "easeInOut",
      repeat: Infinity, // Loop the animation
      repeatType: "loop",
      delay: i * 0.5, // Delay each paw's animation
    },
  }),
};

const HeroSection = () => {
  return (
    <>
      <div className="hero-container">
        <motion.div
          className="left-side"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Navigation Button */}
          <Link to="/" className="nav-link">
            <FaHome /> Back to Home
          </Link>

          <h1 className="main-heading">
            Comprehensive Pet Care Tailored to Every Need
          </h1>
          <p className="sub-text">
            Discover expert services designed to nurture, heal, and ensure the
            happiness of your beloved pets
          </p>

          {/* Paw Walking Animation on Left Side */}
          <div className="paw-walk-container">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="paw-walk-icon"
                variants={pawVariant}
                initial="initial"
                animate="animate"
                custom={i} // Pass the index to the animation
              >
                <FaPaw />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="right-side">
          <div className="image-container main-image-container">
            <motion.img
              src="/images/service1.jpg"
              alt="Pet Care"
              className="main-image"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>

          <div className="image-container top-image-container">
            <motion.img
              src="/images/service2.jpg"
              alt="Floating Pet 1"
              className="top-image"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
            />
          </div>

          <div className="image-container bottom-image-container">
            <motion.img
              src="/images/service3.jpg"
              alt="Floating Pet 2"
              className="bottom-image"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.1 }}
            />
          </div>
        </div>
      </div>

      {/* Moving Signage placed outside the hero-container */}
      <div className="moving-signage">
        <span className="moving-text">
          🐾 Comprehensive Pet Care Services 🐾 | 🐶 Expert Veterinary Care 🐶 | 🐱 Grooming & Wellness 🐱 | 🏥 Veterinary Support 🏥 | 🐾 Pet Adoption 🐾 | 🏠 Boarding 🏠 | 🐕 Pet Daycare 🐕 | 🛒 Pet Supplies 🛒 | ✂️ Grooming Service ✂️  
          🐾 Comprehensive Pet Care Services 🐾 | 🐶 Expert Veterinary Care 🐶 | 🐱 Grooming & Wellness 🐱 | 🏥 Veterinary Support 🏥 | 🐾 Pet Adoption 🐾 | 🏠 Boarding 🏠 | 🐕 Pet Daycare 🐕 | 🛒 Pet Supplies 🐱 | ✂️ Grooming Service ✂️
        </span>
      </div>
    </>
  );
};

export default HeroSection;