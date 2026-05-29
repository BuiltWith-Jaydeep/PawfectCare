import React, { useState, useEffect } from 'react';

const ManagePet = () => {
  const [pets, setPets] = useState([]);
  const [localPets, setLocalPets] = useState([]);
  const [newPet, setNewPet] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchPetData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch pet data');
        const data = await response.json();
        setPets([{ name: data.petName || '', type: data.petType || '', breed: data.breed || '' }]);
      } catch (err) {
        setError(err.message || 'Error fetching pet data');
      }
    };
    fetchPetData();
    setLocalPets(JSON.parse(localStorage.getItem('localPets')) || []);
  }, []);

  const handleAddPet = () => {
    setNewPet({ name: '', type: '', breed: '' });
  };

  const handleNewPetChange = (field, value) => {
    setNewPet({ ...newPet, [field]: value });
  };

  const handleSubmitPet = () => {
    if (newPet.name && newPet.type && newPet.breed) {
      const updatedLocalPets = [...localPets, newPet];
      setLocalPets(updatedLocalPets);
      localStorage.setItem('localPets', JSON.stringify(updatedLocalPets));
      setNewPet(null);
      setSuccess('Pet added successfully !');
    } else {
      setError('Please fill all fields!');
    }
  };

  const handleSave = () => {
    alert('Pet details saved successfully!');
  };

  return (
    <div style={styles.container}>
      {error && <div style={styles.error}>{error}</div>}
      {success && <div style={styles.success}>{success}</div>}
      {/* Backend Pets  */}
      {pets.map((pet, index) => (
        <div key={`backend-${index}`} style={styles.petCard}>
          <div style={styles.field}>
            <label style={styles.label}>Pet Name</label>
            <textarea value={pet.name} style={styles.textarea} disabled rows="1" />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Pet Type</label>
            <textarea value={pet.type} style={styles.textarea} disabled rows="1" />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Breed</label>
            <textarea value={pet.breed} style={styles.textarea} disabled rows="1" />
          </div>
        </div>
      ))}
      {/* Local Pets  */}
      {localPets.map((pet, index) => (
        <div key={`local-${index}`} style={styles.petCard}>
          <div style={styles.field}>
            <label style={styles.label}>Pet Name</label>
            <textarea value={pet.name} style={styles.textarea} disabled rows="1" />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Pet Type</label>
            <textarea value={pet.type} style={styles.textarea} disabled rows="1" />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Breed</label>
            <textarea value={pet.breed} style={styles.textarea} disabled rows="1" />
          </div>
        </div>
      ))}
      {/* New Pet Form  */}
      {newPet && (
        <div style={styles.petCard}>
          <div style={styles.field}>
            <label style={styles.label}>Pet Name</label>
            <input
              value={newPet.name}
              onChange={(e) => handleNewPetChange('name', e.target.value)}
              style={styles.input}
              placeholder="Enter pet name"
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Pet Type</label>
            <input
              value={newPet.type}
              onChange={(e) => handleNewPetChange('type', e.target.value)}
              style={styles.input}
              placeholder="Enter pet type"
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Breed</label>
            <input
              value={newPet.breed}
              onChange={(e) => handleNewPetChange('breed', e.target.value)}
              style={styles.input}
              placeholder="Enter breed"
            />
          </div>
          <button onClick={handleSubmitPet} style={styles.submitButton}>Submit</button>
        </div>
      )}
      <button onClick={handleAddPet} style={styles.addButton}>Add Pet</button>
      <button onClick={handleSave} style={styles.saveButton}>Save Changes</button>
    </div>
  );
};

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '25px' },
  petCard: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  field: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '14px', fontWeight: 500, color: '#333' },
  textarea: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '16px',
    minHeight: '50px',
    resize: 'none',
    outline: 'none',
    backgroundColor: '#f5f5f5',
    color: '#333',
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '16px',
    outline: 'none',
    backgroundColor: '#fff',
    color: '#333',
  },
  addButton: {
    padding: '12px 30px',
    backgroundColor: '#34C759',
    color: '#fff',
    border: 'none',
    borderRadius: '25px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    alignSelf: 'flex-start',
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: '#34C759',
    color: '#fff',
    border: 'none',
    borderRadius: '25px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    alignSelf: 'flex-start',
  },
  saveButton: {
    padding: '12px 30px',
    backgroundColor: '#14B8A6',
    color: '#fff',
    border: 'none',
    borderRadius: '25px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    alignSelf: 'flex-start',
  },
  error: { color: '#e63946', fontSize: '14px', marginBottom: '10px' },
  success: { color: '#34C759', fontSize: '14px', marginBottom: '10px' },
};

export default ManagePet;