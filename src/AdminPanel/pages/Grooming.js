import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from '../styles/AdminPanel.module.css';
import client from '../../api/client';

function Grooming() {
  const [groomings, setGroomings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingGrooming, setEditingGrooming] = useState(null);
  const [formData, setFormData] = useState({});

  // Fetch all grooming appointments
  const fetchGroomings = async () => {
    try {
      const response = await client.get('/api/grooming');
      const data = response.data;
      setGroomings(data);
      setLoading(false);
    } catch (err) {
      console.error('Fetch grooming error:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroomings();
  }, []);

  // Edit handling
  const handleEdit = (grooming) => {
    setEditingGrooming(grooming);
    setFormData(grooming);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await client.put(`/api/grooming/${editingGrooming._id}`, formData);
      setEditingGrooming(null);
      setFormData({});
      await fetchGroomings();
    } catch (err) {
      console.error('Update grooming error:', err);
      setError(err.message);
    }
  };

  // Delete handling
  const handleDelete = async (id) => {
    if (window.confirm('Delete this grooming appointment?')) {
      try {
        await client.delete(`/api/grooming/${id}`);
        await fetchGroomings();
      } catch (err) {
        console.error('Delete grooming error:', err);
        setError(err.message);
      }
    }
  };

  if (loading) return <div>Loading grooming appointments...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <motion.div
      className={styles.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Grooming Management</h2>
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
            <th>Coat Type</th>
            <th>Preference</th>
            <th>Appointment Date</th>
            <th>Time</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {groomings.map((g) => (
            <tr key={g._id}>
              <td>{g._id.slice(-6)}</td>
              <td>{g.userId.slice(-6)}</td>
              <td>{g.name}</td>
              <td>{g.phone}</td>
              <td>{g.email}</td>
              <td>{g.animalType}</td>
              <td>{g.breed}</td>
              <td>{g.age}</td>
              <td>{g.coatType}</td>
              <td>{g.groomingPreference}</td>
              <td>{new Date(g.appointmentDate).toLocaleDateString()}</td>
              <td>{g.appointmentTime}</td>
              <td>₹{g.estimatedPrice}</td>
              <td>
                <button className={styles.button} onClick={() => handleEdit(g)}>
                  Edit
                </button>
                <button className={styles.button} onClick={() => handleDelete(g._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </motion.table>

      {editingGrooming && (
        <div className={styles.formOverlay}>
          <motion.div
            className={styles.form}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2>Edit Grooming Appointment</h2>
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
                Email:
                <input type="email" name="email" value={formData.email || ''} onChange={handleChange} />
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
                Behavioral Notes:
                <input type="text" name="behavioralNotes" value={formData.behavioralNotes || ''} onChange={handleChange} />
              </label>
              <label>
                Coat Type:
                <select name="coatType" value={formData.coatType || ''} onChange={handleChange}>
                  <option value="Short and Smooth">Short and Smooth</option>
                  <option value="Short and Dense">Short and Dense</option>
                  <option value="Medium-Length Coat">Medium-Length Coat</option>
                  <option value="Long and Silky">Long and Silky</option>
                  <option value="Long and Thick">Long and Thick</option>
                  <option value="Curly and Wavy">Curly and Wavy</option>
                  <option value="Wiry and Rough">Wiry and Rough</option>
                  <option value="Double Coat (Thick Undercoat)">Double Coat (Thick Undercoat)</option>
                  <option value="Hairless or Very Short Coat">Hairless or Very Short Coat</option>
                </select>
              </label>
              <label>
                Grooming Preference:
                <select name="groomingPreference" value={formData.groomingPreference || ''} onChange={handleChange}>
                  <option value="Full Body Trim">Full Body Trim</option>
                  <option value="Short Summer Cut">Short Summer Cut</option>
                  <option value="Breed-Specific Cut">Breed-Specific Cut</option>
                  <option value="Hygiene Trim (face, paws, sanitary area)">Hygiene Trim</option>
                  <option value="Deshedding Treatment">Deshedding Treatment</option>
                  <option value="Mat Removal">Mat Removal</option>
                  <option value="Nail Trim Only">Nail Trim Only</option>
                  <option value="Bath & Blow Dry">Bath & Blow Dry</option>
                  <option value="Ear Cleaning">Ear Cleaning</option>
                  <option value="Teeth Brushing">Teeth Brushing</option>
                  <option value="Flea/Tick Bath">Flea/Tick Bath</option>
                  <option value="Medicated Bath (for skin conditions)">Medicated Bath</option>
                </select>
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
                onClick={() => setEditingGrooming(null)}
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
        Add Grooming
      </motion.button>
    </motion.div>
  );
}

export default Grooming;