import React from "react";
import { motion } from "framer-motion";
import "./ServicesSection.css";

const services = [
  {
    id: 1,
    title: "Emergency Care",
    description: "Immediate medical attention for your pets in critical conditions.",
    image: "/images/emergency-care.jpg",
    isLarge: true,
  },
  {
    id: 2,
    title: "Veterinary Consultation",
    description: "Expert advice and treatment for your pet's health.",
    image: "/images/veterinary-consultation.jpg",
    isLarge: false,
  },
  {
    id: 3,
    title: "Grooming Services",
    description: "Professional grooming to keep your pet clean and healthy.",
    image: "/images/grooming-services.jpg",
    isLarge: false,
  },
  {
    id: 4,
    title: "Pet Adoption Assistance",
    description: "Help in finding the perfect pet for your family.",
    image: "/images/pet-adoption.jpg",
    isLarge: false,
  },
  {
    id: 5,
    title: "Pet Boarding & Daycare",
    description: "Safe and comfortable boarding for your pets.",
    image: "/images/pet-boarding.jpg",
    isLarge: false,
  },
  {
    id: 6,
    title: "Vaccination",
    description: "Essential vaccinations to protect your pet's health.",
    image: "/images/vaccination.jpg",
    isLarge: false,
  },
];

const ServicesSection = ({ openModal }) => {
  return (
    <section className="services-section">
      {/* Background Image with Blur Overlay */}
      <div className="background-image">
        <img src="/images/services-bg.jpg" alt="Background" />
        <div className="background-overlay"></div>
      </div>

      {/* Content Container */}
      <div className="content-container">
        {/* Section Heading */}
        <h2 className="section-heading">What We Offer</h2>

        {/* Main Layout */}
        <div className="services-layout">
          {/* Left Side Emergency Services Section */}
          {services
            .filter((service) => service.isLarge)
            .map((service) => (
              <motion.div
                key={service.id}
                className={`service-card large-service ${service.title === "Emergency Care" ? "emergency-style" : ""}`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="service-image">
                  <img src={service.image} alt={service.title} />
                </div>
                <div className="service-content">
                  <h2>{service.title}</h2>
                  <p>{service.description}</p>
                  {service.title !== "Emergency Care" && (
                    <button className="book-now-button" onClick={() => openModal(service.title)}>
                      Book Now
                    </button>
                  )}
                </div>
              </motion.div>
            ))}

          {/* Right Side Other Services Section */}
          <div className="small-services-container">
            {services
              .filter((service) => !service.isLarge)
              .map((service) => (
                <motion.div
                  key={service.id}
                  className="service-bar"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="service-image">
                    <img src={service.image} alt={service.title} />
                  </div>
                  <div className="service-content">
                    <h2>{service.title}</h2>
                    <p>{service.description}</p>
                    <button className="book-now-button" onClick={() => openModal(service.title)}>
                      Book Now
                    </button>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;