import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from '../styles/AdminPanel.module.css';
import client from '../../api/client';

function Daycare() {
  const [dayCares, setDayCares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingDayCare, setEditingDayCare] = useState(null);
  const [formData, setFormData] = useState({});

  // Fetch all daycare bookings
  const fetchDayCares = async () => {
    try {
      const response = await client.get('/api/daycare');
      const data = response.data;
      setDayCares(data);
      setLoading(false);
    } catch (err) {
      console.error('Fetch daycare error:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDayCares();
  }, []);

  // Edit handling
  const handleEdit = (dayCare) => {
    setEditingDayCare(dayCare);
    setFormData(dayCare);
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
      await client.put(`/api/daycare/${editingDayCare._id}`, formData);
      setEditingDayCare(null);
      setFormData({});
      await fetchDayCares();
    } catch (err) {
      console.error('Update daycare error:', err);
      setError(err.message);
    }
  };

  // Delete handling
  const handleDelete = async (id) => {
    if (window.confirm('Delete this daycare booking?')) {
      try {
        await client.delete(`/api/daycare/${id}`);
        await fetchDayCares();
      } catch (err) {
        console.error('Delete daycare error:', err);
        setError(err.message);
      }
    }
  };

  if (loading) return <div>Loading daycare bookings...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <motion.div
      className={styles.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Daycare Management</h2>
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
            <th>Pet Type</th>
            <th>Breed</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>No Allergies</th>
            <th>Socialization</th>
            <th>Emergency Contact</th>
            <th>Appointment Date</th>
            <th>Time</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {dayCares.map((d) => (
            <tr key={d._id}>
              <td>{d._id.slice(-6)}</td>
              <td>{d.userId.slice(-6)}</td>
              <td>{d.name}</td>
              <td>{d.phone}</td>
              <td>{d.petType}</td>
              <td>{d.breed}</td>
              <td>{new Date(d.boardingStartDate).toLocaleDateString()}</td>
              <td>{new Date(d.boardingEndDate).toLocaleDateString()}</td>
              <td>{d.noAllergies ? 'Yes' : 'No'}</td>
              <td>{d.socialization}</td>
              <td>{d.emergencyContact}</td>
              <td>{new Date(d.appointmentDate).toLocaleDateString()}</td>
              <td>{d.appointmentTime}</td>
              <td>₹{d.estimatedPrice}</td>
              <td>
                <button className={styles.button} onClick={() => handleEdit(d)}>
                  Edit
                </button>
                <button className={styles.button} onClick={() => handleDelete(d._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </motion.table>

      {editingDayCare && (
        <div className={styles.formOverlay}>
          <motion.div
            className={styles.form}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2>Edit Daycare Booking</h2>
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
                Address:
                <input type="text" name="address" value={formData.address || ''} onChange={handleChange} />
              </label>
              <label>
                Pet Type:
                <select name="petType" value={formData.petType || ''} onChange={handleChange}>
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                </select>
              </label>
              <label>
                Breed:
                <input type="text" name="breed" value={formData.breed || ''} onChange={handleChange} />
              </label>
              <label>
                Boarding Start Date:
                <input
                  type="date"
                  name="boardingStartDate"
                  value={formData.boardingStartDate ? new Date(formData.boardingStartDate).toISOString().split('T')[0] : ''}
                  onChange={handleChange}
                />
              </label>
              <label>
                Boarding End Date:
                <input
                  type="date"
                  name="boardingEndDate"
                  value={formData.boardingEndDate ? new Date(formData.boardingEndDate).toISOString().split('T')[0] : ''}
                  onChange={handleChange}
                />
              </label>
              <label>
                No Allergies:
                <input
                  type="checkbox"
                  name="noAllergies"
                  checked={formData.noAllergies || false}
                  onChange={handleChange}
                />
              </label>
              <label>
                Socialization:
                <select name="socialization" value={formData.socialization || ''} onChange={handleChange}>
                  <option value="Friendly">Friendly</option>
                  <option value="Calm">Calm</option>
                  <option value="Nervous">Nervous</option>
                  <option value="Anxious">Anxious</option>
                  <option value="Aggressive - People">Aggressive - People</option>
                  <option value="Aggressive - Other Animals">Aggressive - Other Animals</option>
                  <option value="Shy">Shy</option>
                  <option value="Hyperactive">Hyperactive</option>
                  <option value="Fearful of Loud Noises">Fearful of Loud Noises</option>
                  <option value="Chews/Destroys Things">Chews/Destroys Things</option>
                  <option value="Barks/Meows Excessively">Barks/Meows Excessively</option>
                  <option value="Separation Anxiety">Separation Anxiety</option>
                </select>
              </label>
              <label>
                Emergency Contact:
                <input type="text" name="emergencyContact" value={formData.emergencyContact || ''} onChange={handleChange} />
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
                onClick={() => setEditingDayCare(null)}
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
        Add Daycare
      </motion.button>
    </motion.div>
  );
}

export default Daycare;