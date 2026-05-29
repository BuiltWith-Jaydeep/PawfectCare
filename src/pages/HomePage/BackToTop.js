import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import './BackToTop.css'; 

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Toggle visibility based on scroll position
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Smooth scroll to top when button is clicked
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    // Clean up the event listener on component unmount
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div 
      className={`back-to-top ${isVisible ? 'show' : ''}`} 
      onClick={scrollToTop}
    >
      <FaArrowUp />
    </div>
  );
};

export default BackToTop;
