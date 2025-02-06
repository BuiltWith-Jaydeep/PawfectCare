import React from 'react';
import { motion } from 'framer-motion';
import SignupForm from '../components/SignupForm';
import ParticlesBackground from '../components/ParticlesBackground';
import '../assets/styles/App.scss';

const Signup = () => {
  return (
    <div className="auth-page">
      <ParticlesBackground />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <SignupForm />
      </motion.div>
    </div>
  );
};

export default Signup;
