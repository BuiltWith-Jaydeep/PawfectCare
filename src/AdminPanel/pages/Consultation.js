import React, { useState, useEffect } from 'react'; 
import { motion } from 'framer-motion';
import styles from '../styles/AdminPanel.module.css';
import client from '../../api/client';

function Consultation() {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingConsultation, setEditingConsultation] = useState(null);
  const [formData, setFormData] = useState({});

  // Fetch all consultations
  const fetchConsultations = async () => {
    try {
      const response = await client.get('/api/consultations');
      const data = response.data;
      setConsultations(data);
      setLoading(false);
    } catch (err) {
      console.error('Fetch consultations error:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  // Edit handling
  const handleEdit = (consultation) => {
    setEditingConsultation(consultation);
    setFormData(consultation);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await client.put(`/api/consultations/${editingConsultation._id}`, formData);
      setEditingConsultation(null);
      setFormData({});
      await fetchConsultations();
    } catch (err) {
      console.error('Update consultation error:', err);
      setError(err.message);
    }
  };

  // Delete handling
  const handleDelete = async (id) => {
    if (window.confirm('Delete this consultation?')) {
      try {
        await client.delete(`/api/consultations/${id}`);
        await fetchConsultations();
      } catch (err) {
        console.error('Delete consultation error:', err);
        setError(err.message);
      }
    }
  };

  if (loading) return <div>Loading consultations...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <motion.div
      className={styles.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Consultation Management</h2>
      <motion.table
        className={styles.table}
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
        initial="hidden"
        animate="visible"
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Animal Type</th>
            <th>Breed</th>
            <th>Age</th>
            <th>Reason</th>
            <th>Consent</th>
            <th>Appointment Date</th>
            <th>Time</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {consultations.map((c) => (
            <tr key={c._id}>
              <td>{c._id.slice(-6)}</td>
              <td>{c.userId.slice(-6)}</td>
              <td>{c.name}</td>
              <td>{c.phone}</td>
              <td>{c.email}</td>
              <td>{c.animalType}</td>
              <td>{c.breed}</td>
              <td>{c.age}</td>
              <td>{c.reason}</td>
              <td>{c.consent ? 'Yes' : 'No'}</td>
              <td>{new Date(c.appointmentDate).toLocaleDateString()}</td>
              <td>{c.appointmentTime}</td>
              <td>₹{c.estimatedPrice}</td>
              <td>
                <button className={styles.button} onClick={() => handleEdit(c)}>
                  Edit
                </button>
                <button className={styles.button} onClick={() => handleDelete(c._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </motion.table>

      {editingConsultation && (
        <div className={styles.formOverlay}>
          <motion.div
            className={styles.form}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2>Edit Consultation</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Name:
                <input type="text" name="name" value={formData.name || ''} onChange={handleChange} />
              </label>
              <label>
                Phone:
                <input type="text" name="phone" value={formData.phone || ''} onChange={handleChange} />
              </label>
              <label>
                Email:
                <input type="email" name="email" value={formData.email || ''} onChange={handleChange} />
              </label>
              <label>
                Address:
                <input type="text" name="address" value={formData.address || ''} onChange={handleChange} />
              </label>
              <label>
                Animal Type:
                <select name="animalType" value={formData.animalType || ''} onChange={handleChange}>
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                </select>
              </label>
              <label>
                Breed:
                <input type="text" name="breed" value={formData.breed || ''} onChange={handleChange} />
              </label>
              <label>
                Age:
                <input type="number" name="age" value={formData.age || ''} onChange={handleChange} />
              </label>
              <label>
                Medical History:
                <input type="text" name="medicalHistory" value={formData.medicalHistory || ''} onChange={handleChange} />
              </label>
              <label>
                Reason:
                <input type="text" name="reason" value={formData.reason || ''} onChange={handleChange} />
              </label>
              <label>
                Behavioral Notes:
                <input type="text" name="behavioralNotes" value={formData.behavioralNotes || ''} onChange={handleChange} />
              </label>
              <label>
                Consent:
                <input
                  type="checkbox"
                  name="consent"
                  checked={formData.consent || false}
                  onChange={handleChange}
                />
              </label>
              <label>
                Appointment Date:
                <input
                  type="date"
                  name="appointmentDate"
                  value={formData.appointmentDate ? new Date(formData.appointmentDate).toISOString().split('T')[0] : ''}
                  onChange={handleChange}
                />
              </label>
              <label>
                Appointment Time:
                <select name="appointmentTime" value={formData.appointmentTime || ''} onChange={handleChange}>
                  <option value="9 to 12">9 to 12</option>
                  <option value="1 to 4">1 to 4</option>
                  <option value="4 to 7">4 to 7</option>
                </select>
              </label>
              <label>
                Estimated Price:
                <input type="number" name="estimatedPrice" value={formData.estimatedPrice || ''} onChange={handleChange} />
              </label>
              <button type="submit" className={styles.button}>
                Save
              </button>
              <button
                type="button"
                className={styles.button}
                onClick={() => setEditingConsultation(null)}
              >
                Cancel
              </button>
            </form>
          </motion.div>
        </div>
      )}

      <motion.button
        className={styles.addButton}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Add Consultation
      </motion.button>
    </motion.div>
  );
}

export default Consultation;