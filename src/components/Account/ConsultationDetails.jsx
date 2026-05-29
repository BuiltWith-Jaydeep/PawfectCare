import React from 'react';

const ConsultationDetails = ({ consultations, onClose }) => {
  return (
    <>
      {/* Overlay */}
      <div style={styles.overlay} onClick={onClose}></div>

      {/* Details Container */}
      <div style={styles.detailsContainer}>
        <div style={styles.header}>
          <h2 style={styles.title}>Veterinary Consultation Details</h2>
          <button style={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>
        <div style={styles.content}>
          {consultations.map((consultation, index) => (
            <div key={index} style={{
              ...styles.consultationCard,
              animation: `slideUp 0.5s ease forwards ${index * 0.1}s`, // Staggered animation
            }}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Consultation #{index + 1}</h3>
                <span style={styles.date}>
                  Booked: {new Date(consultation.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div style={styles.cardBody}>
                <p style={styles.detail}><strong>Name:</strong> {consultation.name}</p>
                <p style={styles.detail}><strong>Phone:</strong> {consultation.phone}</p>
                <p style={styles.detail}><strong>Address:</strong> {consultation.address}</p>
                <p style={styles.detail}><strong>Email:</strong> {consultation.email}</p>
                <p style={styles.detail}><strong>Animal Type:</strong> {consultation.animalType}</p>
                <p style={styles.detail}><strong>Breed:</strong> {consultation.breed}</p>
                <p style={styles.detail}><strong>Age:</strong> {consultation.age} years</p>
                <p style={styles.detail}><strong>Medical History:</strong> {consultation.medicalHistory}</p>
                <p style={styles.detail}><strong>Reason:</strong> {consultation.reason}</p>
                <p style={styles.detail}><strong>Behavioral Notes:</strong> {consultation.behavioralNotes}</p>
                <p style={styles.detail}><strong>Consent:</strong> {consultation.consent ? 'Yes' : 'No'}</p>
                <p style={styles.detail}>
                  <strong>Appointment:</strong> {new Date(consultation.appointmentDate).toLocaleDateString()} ({consultation.appointmentTime})
                </p>
                <p style={styles.detail}><strong>Estimated Price:</strong> ₹{consultation.estimatedPrice}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inline Keyframe Animation */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 1000,
    animation: 'fadeIn 0.3s ease',
  },
  detailsContainer: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    borderRadius: '20px',
    boxShadow: '0 15px 40px rgba(0,0,0,0.2)',
    width: '90%',
    maxWidth: '700px',
    maxHeight: '85vh',
    overflowY: 'auto',
    zIndex: 1100,
    padding: '40px',
    animation: 'zoomIn 0.4s ease',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    borderBottom: '3px solid #14B8A6',
    paddingBottom: '15px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 700,
    color: '#14B8A6',
    margin: 0,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '28px',
    color: '#666',
    cursor: 'pointer',
    transition: 'color 0.3s',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '25px',
  },
  consultationCard: {
    backgroundColor: '#f9fafb',
    padding: '25px',
    borderRadius: '15px',
    boxShadow: '0 6px 20px rgba(0,0,0,0.05)',
    borderLeft: '5px solid #14B8A6',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#14B8A6',
    margin: 0,
  },
  date: {
    fontSize: '14px',
    color: '#888',
  },
  cardBody: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
  },
  detail: {
    fontSize: '16px',
    color: '#333',
    margin: 0,
  },
};

export default ConsultationDetails;