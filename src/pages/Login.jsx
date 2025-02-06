import React from 'react';
import { motion } from 'framer-motion';
import ParticlesBackground from '../components/ParticlesBackground';
import LoginForm from '../components/LoginForm';
import '../assets/styles/App.scss';

const Login = () => {
  return (
    <div className="auth-page">
      <ParticlesBackground />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <LoginForm />
      </motion.div>
    </div>
  );
};

export default Login;
