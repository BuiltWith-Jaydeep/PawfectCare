import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import './IntroAnimation.css';

const textVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.8
  },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.3,
      duration: 0.8,
      ease: [0.175, 0.885, 0.32, 1.275] // Custom cubic bezier
    },
  }),
};

const particleVariants = {
  hidden: { opacity: 0 },
  visible: (i) => ({
    opacity: [0, 0.6, 0],
    scale: [0, 1.2, 0],
    transition: {
      duration: 2 + Math.random() * 2,
      delay: i * 0.1,
      repeat: Infinity,
      repeatType: "loop"
    }
  })
};

const IntroAnimation = ({ onAnimationComplete }) => {
  const [particles, setParticles] = useState([]);
  const controls = useAnimation();

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 30 + 10
    }));
    setParticles(newParticles);

    const sequence = async () => {
      await controls.start("visible");
      setTimeout(onAnimationComplete, 2000);
    };
    sequence();
  }, [controls, onAnimationComplete]);

  const textArray = ['Welcome', 'to', 'Pawfect', 'Care'];

  return (
    <div className="intro-container">
      {/* Particles Background */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="particle"
          variants={particleVariants}
          custom={particle.id}
          initial="hidden"
          animate="visible"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
        />
      ))}

      {/* Main Image Container */}
      <motion.div 
        className="image-container"
        animate={{
          rotateY: 360,
          scale: [0.9, 1.1, 0.9],
        }}
        transition={{
          duration: 8,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        <motion.img
          src="/assets/images/pet.png"
          alt="Rotating Pet"
          className="intro-image"
          animate={{
            rotateZ: 360
          }}
          transition={{
            duration: 6,
            ease: "linear",
            repeat: Infinity
          }}
        />
      </motion.div>

      {/* Text Animation */}
      <div className="intro-text">
        {textArray.map((word, index) => (
          <motion.span
            key={index}
            custom={index}
            variants={textVariants}
            initial="hidden"
            animate={controls}
            className="intro-word"
            whileHover={{ 
              scale: 1.2, 
              y: -10,
              textShadow: "0 10px 20px rgba(0,0,0,0.3)"
            }}
          >
            {word}
          </motion.span>
        ))}
      </div>

      {/* Progress Bar */}
      <motion.div 
        className="progress-bar"
        initial={{ width: '0%' }}
        animate={{ width: '100%' }}
        transition={{ duration: 5, ease: "linear" }}
      />
    </div>
  );
};

export default IntroAnimation;