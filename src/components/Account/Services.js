import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ConsultationDetails from './ConsultationDetails';
import GroomingDetails from './GroomingDetails';
import AdoptionDetails from './AdoptionDetails';
import DayCareDetails from './DayCareDetails';
import VaccinationDetails from './VaccinationDetails';
import client from '../../api/client';

const Services = () => {
  const { user, isAuthenticated } = useAuth();
  const [consultations, setConsultations] = useState([]);
  const [groomingAppointments, setGroomingAppointments] = useState([]);
  const [adoptionRequests, setAdoptionRequests] = useState([]);
  const [dayCareBookings, setDayCareBookings] = useState([]);
  const [vaccinations, setVaccinations] = useState([]);
  const [showConsultationDetails, setShowConsultationDetails] = useState(false);
  const [showGroomingDetails, setShowGroomingDetails] = useState(false);
  const [showAdoptionDetails, setShowAdoptionDetails] = useState(false);
  const [showDayCareDetails, setShowDayCareDetails] = useState(false);
  const [showVaccinationDetails, setShowVaccinationDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      if (!isAuthenticated || !user) {
        setError('Please log in to view your services.');
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in again.');
        setLoading(false);
        return;
      }

      // Log the user ID to debug
      console.log('Fetching services for user ID:', user.id);

      // Use the logged-in user's ID
      const userId = user.id;

      try {
        // Fetch Consultations
        const consultationResponse = await client.get(`/api/consultations/user/${userId}`);
        const consultationData = consultationResponse.data;
        console.log('Consultation data:', consultationData);
        setConsultations(consultationData);

        // Fetch Grooming Appointments
        const groomingResponse = await client.get(`/api/grooming/user/${userId}`);
        const groomingData = groomingResponse.data;
        console.log('Grooming data:', groomingData);
        setGroomingAppointments(groomingData);

        // Fetch Adoption Requests
        const adoptionResponse = await client.get(`/api/adoption/user/${userId}`);
        const adoptionData = adoptionResponse.data;
        console.log('Adoption data:', adoptionData);
        setAdoptionRequests(adoptionData);

        // Fetch DayCare Bookings
        const dayCareResponse = await client.get(`/api/daycare/user/${userId}`);
        const dayCareData = dayCareResponse.data;
        console.log('Daycare data:', dayCareData);
        setDayCareBookings(dayCareData);

        // Fetch Vaccinations
        const vaccinationResponse = await client.get(`/api/vaccinations/user/${userId}`);
        const vaccinationData = vaccinationResponse.data;
        console.log('Vaccination data:', vaccinationData);
        setVaccinations(vaccinationData);
      } catch (err) {
        setError(err.message || 'Error fetching services');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [isAuthenticated, user]);

  const handleViewConsultationDetails = () => setShowConsultationDetails(true);
  const handleCloseConsultationDetails = () => setShowConsultationDetails(false);
  const handleViewGroomingDetails = () => setShowGroomingDetails(true);
  const handleCloseGroomingDetails = () => setShowGroomingDetails(false);
  const handleViewAdoptionDetails = () => setShowAdoptionDetails(true);
  const handleCloseAdoptionDetails = () => setShowAdoptionDetails(false);
  const handleViewDayCareDetails = () => setShowDayCareDetails(true);
  const handleCloseDayCareDetails = () => setShowDayCareDetails(false);
  const handleViewVaccinationDetails = () => setShowVaccinationDetails(true);
  const handleCloseVaccinationDetails = () => setShowVaccinationDetails(false);

  return (
    <div style={styles.container}>
      {loading && <p style={styles.loading}>Loading your services...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {!loading && !error && (
        <>
          <div style={styles.serviceCard}>
            <h3 style={styles.serviceName}>Veterinary Consultation</h3>
            <p style={styles.description}>
              {consultations.length > 0
                ? `You have ${consultations.length} consultation(s) booked`
                : 'No consultations booked yet'}
            </p>
            <button
              style={styles.button}
              onClick={handleViewConsultationDetails}
              disabled={consultations.length === 0}
            >
              View Details
            </button>
          </div>

          <div style={styles.serviceCard}>
            <h3 style={styles.serviceName}>Grooming Services</h3>
            <p style={styles.description}>
              {groomingAppointments.length > 0
                ? `You have ${groomingAppointments.length} appointment(s) booked`
                : 'No grooming appointments booked yet'}
            </p>
            <button
              style={styles.button}
              onClick={handleViewGroomingDetails}
              disabled={groomingAppointments.length === 0}
            >
              View Details
            </button>
          </div>

          <div style={styles.serviceCard}>
            <h3 style={styles.serviceName}>Pet Adoption Assistance</h3>
            <p style={styles.description}>
              {adoptionRequests.length > 0
                ? `You have ${adoptionRequests.length} request(s) submitted`
                : 'No adoption requests submitted yet'}
            </p>
            <button
              style={styles.button}
              onClick={handleViewAdoptionDetails}
              disabled={adoptionRequests.length === 0}
            >
              View Details
            </button>
          </div>

          <div style={styles.serviceCard}>
            <h3 style={styles.serviceName}>Pet Boarding & Daycare</h3>
            <p style={styles.description}>
              {dayCareBookings.length > 0
                ? `You have ${dayCareBookings.length} booking(s) scheduled`
                : 'No daycare bookings scheduled yet'}
            </p>
            <button
              style={styles.button}
              onClick={handleViewDayCareDetails}
              disabled={dayCareBookings.length === 0}
            >
              View Details
            </button>
          </div>

          <div style={styles.serviceCard}>
            <h3 style={styles.serviceName}>Vaccination</h3>
            <p style={styles.description}>
              {vaccinations.length > 0
                ? `You have ${vaccinations.length} vaccination(s) booked`
                : 'No vaccinations booked yet'}
            </p>
            <button
              style={styles.button}
              onClick={handleViewVaccinationDetails}
              disabled={vaccinations.length === 0}
            >
              View Details
            </button>
          </div>
        </>
      )}

      {showConsultationDetails && (
        <ConsultationDetails consultations={consultations} onClose={handleCloseConsultationDetails} />
      )}
      {showGroomingDetails && (
        <GroomingDetails groomingAppointments={groomingAppointments} onClose={handleCloseGroomingDetails} />
      )}
      {showAdoptionDetails && (
        <AdoptionDetails adoptionRequests={adoptionRequests} onClose={handleCloseAdoptionDetails} />
      )}
      {showDayCareDetails && (
        <DayCareDetails dayCareBookings={dayCareBookings} onClose={handleCloseDayCareDetails} />
      )}
      {showVaccinationDetails && (
        <VaccinationDetails vaccinations={vaccinations} onClose={handleCloseVaccinationDetails} />
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
    position: 'relative',
  },
  serviceCard: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '15px',
    boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
    textAlign: 'center',
    minHeight: '200px',
    transition: 'transform 0.3s ease',
    '&:hover': { transform: 'translateY(-5px)' },
  },
  serviceName: {
    fontSize: '22px',
    fontWeight: 600,
    color: '#14B8A6',
    marginBottom: '15px',
  },
  description: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '20px',
  },
  button: {
    padding: '12px 25px',
    backgroundColor: '#14B8A6',
    color: '#fff',
    border: 'none',
    borderRadius: '25px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    '&:hover': { backgroundColor: '#0d9488' },
    '&:disabled': { backgroundColor: '#ccc', cursor: 'not-allowed' },
  },
  loading: {
    fontSize: '18px',
    color: '#666',
    textAlign: 'center',
    gridColumn: '1 / -1',
  },
  error: {
    fontSize: '18px',
    color: '#e63946',
    textAlign: 'center',
    gridColumn: '1 / -1',
  },
};

export default Services;