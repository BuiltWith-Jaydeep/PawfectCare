import React from "react";
import { useInView } from "react-intersection-observer";
import "./SFooter.css";

const Footer = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <footer 
      ref={ref}
      className={`footer-container ${inView ? "animate" : ""}`}
    >
      <div className="footer-content">
        {/* Footer Columns */}
        <div className="footer-grid">
          {/* Features Column */}
          <div className="footer-column">
            <h3 className="column-title">Features</h3>
            <ul className="footer-links">
              <li><a href="/services">Our Services</a></li>
              <li><a href="/services">Subscription Plans</a></li>
              <li><a href="/services">Book an Appointment</a></li>
              <li><a href="/shop">Pet Shop</a></li>
              <li><a href="/testimonials">Customer Stories</a></li>
            </ul>
          </div>

          {/* Solutions Column */}
          <div className="footer-column">
            <h3 className="column-title">Solutions</h3>
            <ul className="footer-links">
              <li><a href="/pet-health">Pet Health Management</a></li>
              <li><a href="/grooming">Grooming & Care</a></li>
              <li><a href="/boarding">Boarding & Daycare</a></li>
              <li><a href="/adoption">Adoption Assistance</a></li>
              <li><a href="/vaccination">Vaccination Programs</a></li>
            </ul>
          </div>

          

          {/* About Column */}
          <div className="footer-column">
            <h3 className="column-title">About</h3>
            <ul className="footer-links">
              <li><a href="/about">About Us</a></li>
              <li><a href="/team">Meet the Team</a></li>
              
              <li><a href="/contact">Contact Us</a></li>
              <li><a href="/terms-and-conditions">Privacy Policy</a></li>
              <li><a href="/terms-and-conditions">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="copyright-section">
          <p>© 2024 PawfectCare, All rights reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;