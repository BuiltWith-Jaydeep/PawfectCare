import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import IntroAnimation from './components/IntroAnimation/IntroAnimation';
import HomePage from './pages/HomePage/HomePage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ParticlesBackground from './components/ParticlesBackground';

function App() {
  const [isIntroComplete, setIsIntroComplete] = useState(false);

  return (
    <AnimatePresence mode="wait">
      {!isIntroComplete ? (
        <IntroAnimation key="intro" onAnimationComplete={() => setIsIntroComplete(true)} />
      ) : (
        <>
          <ParticlesBackground />
          <Routes>
            <Route path="/" element={<HomePage key="home" />} />
            <Route path="/login" element={<Login key="login" />} />
            <Route path="/signup" element={<Signup key="signup" />} />
          </Routes>
        </>
      )}
    </AnimatePresence>
  );
}

export default App;
