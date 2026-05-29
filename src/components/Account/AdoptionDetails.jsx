import React from 'react';

const AdoptionDetails = ({ adoptionRequests, onClose }) => {
  return (
    <>
      <div style={styles.overlay} onClick={onClose}></div>
      <div style={styles.detailsContainer}>
        <div style={styles.header}>
          <h2 style={styles.title}>Pet Adoption Assistance Details</h2>
          <button style={styles.closeButton} onClick={onClose}>✕</button>
        </div>
        <div style={styles.content}>
          {adoptionRequests.map((request, index) => (
            <div
              key={index}
              style={{
                ...styles.requestCard,
                animation: `slideUp 0.5s ease forwards ${index * 0.1}s`,
              }}
            >
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Request #{index + 1}</h3>
                <span style={styles.date}>
                  Submitted: {new Date(request.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div style={styles.cardBody}>
                <p style={styles.detail}><strong>Name:</strong> {request.name}</p>
                <p style={styles.detail}><strong>Phone:</strong> {request.phone}</p>
                <p style={styles.detail}><strong>Address:</strong> {request.address}</p>
                <p style={styles.detail}><strong>Housing Type:</strong> {request.housingType}</p>
                {request.housingType === 'Rent' && (
                  <p style={styles.detail}><strong>Landlord Approval:</strong> {request.landlordApproval ? 'Yes' : 'No'}</p>
                )}
                <p style={styles.detail}><strong>Pet Type:</strong> {request.petType}</p>
                <p style={styles.detail}><strong>Pet Experience:</strong> {request.petExperience}</p>
                <p style={styles.detail}><strong>Home Visit Agreement:</strong> {request.homeVisitAgreement ? 'Yes' : 'No'}</p>
                <p style={styles.detail}>
                  <strong>Appointment:</strong> {new Date(request.appointmentDate).toLocaleDateString()} ({request.appointmentTime})
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoomIn {
          from { transform: translate(-50%, -50%) scale(0.9); opacity: 0; }
          to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
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
    '&:hover': { color: '#14B8A6' },
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '25px',
  },
  requestCard: {
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

export default AdoptionDetails;