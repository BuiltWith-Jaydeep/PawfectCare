import React, { useState } from 'react';
import './FormSection.css';

const FormSection = () => {
  const [name, setName] = useState('');
  const [selectedService, setSelectedService] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && selectedService) {
      // Scroll down 25% of the viewport height
      const scrollDistance = window.innerHeight * 0.75; // 25% of screen height
      window.scrollTo({
        top: window.scrollY + scrollDistance, // Current position + 25%
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="form-section">
      <div className="form-container">
        <div className="form-image-container">
          <div className="image-wrapper">
            <img 
              src="/images/pet-care-form.jpg" 
              alt="Pet Care" 
              className="modern-image"
            />
            <div className="image-overlay"></div>
          </div>
        </div>

        <div className="form-content">
          <div className="form-header">
            <h2>Ensuring Care and Support for Your Beloved Pet's</h2>
            <p>Our veterinary clinic provides comprehensive and compassionate care for your beloved pets</p>
          </div>
          
          <form className="advanced-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <input 
                type="text" 
                placeholder="Your Name" 
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <div className="custom-select">
                <select 
                  className="form-select"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                >
                  <option value="">Select Service</option>
                  <option>Veterinary Consultation</option>
                  <option>Grooming Service</option>
                  <option>Pet Boarding</option>
                  <option>Vaccination</option>
                  <option>Pet Adoption</option>
                </select>
                <span className="select-arrow"></span>
              </div>
            </div>
            
            <button 
              type="submit" 
              className="form-button"
              disabled={!name.trim() || !selectedService}
            >
              Book Now
            </button>
          </form>
        </div>
      </div>

      <div className="bg-animation">
        <div className="circle-anim-1"></div>
        <div className="circle-anim-2"></div>
      </div>
    </section>
  );
};

export default FormSection;