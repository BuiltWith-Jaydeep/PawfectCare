import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import IntroAnimation from './components/IntroAnimation/IntroAnimation';
import HomePage from './pages/HomePage/HomePage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ContactPage from './pages/ContactPage/ContactPage';
import MyAccountPage from './pages/MyAccountPage';
import ParticlesBackground from './components/ParticlesBackground';
// AuthProvider is mounted once in index.js (single source of auth truth).
import { useAuth } from './context/AuthContext';
import ShopPage from './pages/ShopPage/ShopPage';
import BackToTop from './pages/HomePage/BackToTop';
import ServicePage from './pages/ServicePage';
import ReviewOrder from './pages/ReviewOrder';
import TermsAndConditions from './pages/TnC/TermsAndConditions';
import PaymentSuccess from './components/PaymentSuccess';
import Modal from 'react-modal';
import Success from './components/Success';
import CustomerStories from './pages/CustomerStories';
import PetHealthManagement from './pages/Solutions/PetHealthManagement';
import GroomingCare from './pages/Solutions/GroomingCare';
import BoardingDaycare from './pages/Solutions/BoardingDaycare';
import AdoptionAssistance from './pages/Solutions/AdoptionAssistance';
import VaccinationPrograms from './pages/Solutions/VaccinationPrograms';
import PetCareBlog from './pages/PetCareBlog';
import CareGuides from './pages/CareGuides';
import FAQs from './pages/FAQs';
import AboutPawfectCare from './pages/AboutPawfectCare';
import MeetTheTeam from './pages/MeetTheTeam';
import AdminPanel from './AdminPanel/AdminPanel'; // AdminPanel handles 

// Protected Route Component — requires any logged-in user
const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

// Admin Route Component — requires a logged-in user whose role is 'admin'.
// This is a UX guard only: it stops the admin shell from rendering for the
// wrong user. Real enforcement lives on the server (`requireAdmin`), which
// every admin endpoint applies independently.
const AdminRoute = ({ element }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/" replace />;
  return element;
};

function App() {
  const [isIntroComplete, setIsIntroComplete] = useState(false);

  Modal.setAppElement('#root');

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
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/checkout" element={<ReviewOrder />} />
              <Route path="/services" element={<ServicePage />} />
              <Route path="/service" element={<ServicePage />} />
              <Route path="/success" element={<Success />} />
              <Route path="/my-account" element={<ProtectedRoute element={<MyAccountPage key="myAccount" />} />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              {/* Admin Panel Route - Includes /admin/users for Users.js */}
              {/* access: admin only */}
              <Route path="/admin/*" element={<AdminRoute element={<AdminPanel />} />} />
              {/* Footer Routes */}
              <Route path="/testimonials" element={<CustomerStories />} />
              <Route path="/pet-health" element={<PetHealthManagement />} />
              <Route path="/grooming" element={<GroomingCare />} />
              <Route path="/boarding" element={<BoardingDaycare />} />
              <Route path="/adoption" element={<AdoptionAssistance />} />
              <Route path="/vaccination" element={<VaccinationPrograms />} />
              <Route path="/blog" element={<PetCareBlog />} />
              <Route path="/guides" element={<CareGuides />} />
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/about" element={<AboutPawfectCare />} />
              <Route path="/team" element={<MeetTheTeam />} />
            </Routes>
            <BackToTop />
          </>
        )}
    </AnimatePresence>
  );
}

export default App;