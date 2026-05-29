import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import HeroSection from "../components/ServiceComponents/HeroSection/HeroSection";
import FormSection from "../components/ServiceComponents/FormSection/FormSection";
import ServicesSection from "../components/ServiceComponents/ServicesSection/ServicesSection";
import PricingSection from "../components/ServiceComponents/PricingSection/PricingSection";
import Footer from "../components/ServiceComponents/SFooter/SFooter";
import BookingForm from "../components/BookingForm";
import GroomingForm from "../components/GroomingForm"; 
import AdoptionForm from "../components/AdoptionForm"; 
import DayCare from "../components/DayCare"; 
import VaccinationForm from "../components/VaccinationForm"; 
import { useAuth } from "../context/AuthContext"; 

const ServicePage = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false); // State for BookingForm
  const [isGroomingModalOpen, setIsGroomingModalOpen] = useState(false); // State for GroomingForm
  const [isAdoptionModalOpen, setIsAdoptionModalOpen] = useState(false); // State for AdoptionForm
  const [isBoardingModalOpen, setIsBoardingModalOpen] = useState(false); // State for DayCare
  const [isVaccinationModalOpen, setIsVaccinationModalOpen] = useState(false); // State for VaccinationForm
  const { isAuthenticated } = useAuth(); // Get auth status from useAuth
  const navigate = useNavigate();

  const openModal = (serviceTitle) => {
    if (isAuthenticated) {
      if (serviceTitle === "Grooming Services") {
        setIsGroomingModalOpen(true); // Open GroomingForm for Grooming Services
      } else if (serviceTitle === "Pet Adoption Assistance") {
        setIsAdoptionModalOpen(true); // Open AdoptionForm for Pet Adoption Assistance
      } else if (serviceTitle === "Pet Boarding & Daycare") {
        setIsBoardingModalOpen(true); // Open DayCare for Pet Boarding & Daycare
      } else if (serviceTitle === "Vaccination") {
        setIsVaccinationModalOpen(true); // Open VaccinationForm for Vaccination
      } else {
        setIsBookingModalOpen(true); // Open BookingForm for all other services 
      }
    } else {
      navigate("/login"); // Redirect to login if not authenticated
    }
  };

  const closeBookingModal = () => setIsBookingModalOpen(false);
  const closeGroomingModal = () => setIsGroomingModalOpen(false);
  const closeAdoptionModal = () => setIsAdoptionModalOpen(false);
  const closeBoardingModal = () => setIsBoardingModalOpen(false);
  const closeVaccinationModal = () => setIsVaccinationModalOpen(false);

  return (
    <div>
      <HeroSection />
      <FormSection />
      <ServicesSection openModal={openModal} />
      <PricingSection />
      <Footer />
      {isAuthenticated && <BookingForm isOpen={isBookingModalOpen} onClose={closeBookingModal} />}
      {isAuthenticated && <GroomingForm isOpen={isGroomingModalOpen} onClose={closeGroomingModal} />}
      {isAuthenticated && <AdoptionForm isOpen={isAdoptionModalOpen} onClose={closeAdoptionModal} />}
      {isAuthenticated && <DayCare isOpen={isBoardingModalOpen} onClose={closeBoardingModal} />}
      {isAuthenticated && <VaccinationForm isOpen={isVaccinationModalOpen} onClose={closeVaccinationModal} />}
    </div>
  );
};

export default ServicePage;