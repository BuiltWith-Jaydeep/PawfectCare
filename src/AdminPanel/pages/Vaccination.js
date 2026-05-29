import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from '../styles/AdminPanel.module.css';

function Vaccination() {
  const [vaccinations, setVaccinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingVaccination, setEditingVaccination] = useState(null);
  const [formData, setFormData] = useState({});

  // Fetch all vaccinations
  const fetchVaccinations = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/vaccinations', {
        method: 'GET',
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setVaccinations(data);
      setLoading(false);
    } catch (err) {
      console.error('Fetch vaccinations error:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVaccinations();
  }, []);

  // Edit handling
  const handleEdit = (vaccination) => {
    setEditingVaccination(vaccination);
    setFormData(vaccination);
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
      const response = await fetch(`http://localhost:5000/api/vaccinations/${editingVaccination._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to update vaccination');
      setEditingVaccination(null);
      setFormData({});
      await fetchVaccinations();
    } catch (err) {
      console.error('Update vaccination error:', err);
      setError(err.message);
    }
  };

  // Delete handling
  const handleDelete = async (id) => {
    if (window.confirm('Delete this vaccination appointment?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/vaccinations/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete vaccination');
        await fetchVaccinations();
      } catch (err) {
        console.error('Delete vaccination error:', err);
        setError(err.message);
      }
    }
  };

  if (loading) return <div>Loading vaccinations...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <motion.div
      className={styles.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Vaccination Management</h2>
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
            <th>Age</th>
            <th>Vaccine</th>
            <th>Appointment Date</th>
            <th>Time</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vaccinations.map((v) => (
            <tr key={v._id}>
              <td>{v._id.slice(-6)}</td>
              <td>{v.userId.slice(-6)}</td>
              <td>{v.name}</td>
              <td>{v.phone}</td>
              <td>{v.petType}</td>
              <td>{v.breed}</td>
              <td>{v.age}</td>
              <td>{v.vaccine}</td>
              <td>{new Date(v.appointmentDate).toLocaleDateString()}</td>
              <td>{v.appointmentTime}</td>
              <td>₹{v.estimatedPrice}</td>
              <td>
                <button className={styles.button} onClick={() => handleEdit(v)}>
                  Edit
                </button>
                <button className={styles.button} onClick={() => handleDelete(v._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </motion.table>

      {editingVaccination && (
        <div className={styles.formOverlay}>
          <motion.div
            className={styles.form}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2>Edit Vaccination</h2>
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
                Age:
                <input type="number" name="age" value={formData.age || ''} onChange={handleChange} />
              </label>
              <label>
                Vaccine:
                <select name="vaccine" value={formData.vaccine || ''} onChange={handleChange}>
                  <option value="Rabies">Rabies</option>
                  <option value="Distemper">Distemper</option>
                  <option value="Parvovirus">Parvovirus</option>
                  <option value="Bordetella">Bordetella</option>
                  <option value="Feline Calicivirus">Feline Calicivirus</option>
                  <option value="Feline Panleukopenia">Feline Panleukopenia</option>
                  <option value="Leptospirosis">Leptospirosis</option>
                  <option value="Canine Influenza">Canine Influenza</option>
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
                onClick={() => setEditingVaccination(null)}
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
        Add Vaccination
      </motion.button>
    </motion.div>
  );
}

export default Vaccination;