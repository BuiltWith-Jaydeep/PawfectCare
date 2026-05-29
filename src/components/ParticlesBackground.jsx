import React from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';

const ParticlesBackground = () => {
  // Initialize tsparticles with the slim version for better performance
  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  // Configuration for the particles
  const particlesConfig = {
    fullScreen: {
      enable: true,
      zIndex: -1 // Puts particles behind everything else
    },
    particles: {
      number: {
        value: 100, // Decent amount for a cool effect
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: "#ffffff" // White particles, looks good on dark backgrounds
      },
      shape: {
        type: "circle" // Simple circular particles
      },
      opacity: {
        value: 0.5,
        random: true // Adds some variety
      },
      size: {
        value: 3, // Small particles as requested
        random: true
      },
      move: {
        enable: true,
        speed: 1, // Subtle movement
        direction: "none",
        random: false,
        straight: false,
        out_mode: "out",
        bounce: false
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "repulse" // Particles move away when you hover
        },
        onclick: {
          enable: true,
          mode: "push" // Adds particles when you click
        },
        resize: true
      },
      modes: {
        repulse: {
          distance: 100,
          duration: 0.4
        },
        push: {
          particles_nb: 4 // Number of particles added on click
        }
      }
    },
    retina_detect: true // Looks crisp on high-res screens
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={particlesConfig}
    />
  );
};

export default ParticlesBackground;