import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from '../styles/AdminPanel.module.css';
import client from '../../api/client';

function Adoption() {
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingAdoption, setEditingAdoption] = useState(null);
  const [formData, setFormData] = useState({});

  // Fetch all adoptions from the backend
  const fetchAdoptions = async () => {
    try {
      const response = await client.get('/api/adoption');


      const data = response.data;
      setAdoptions(data);
      setLoading(false);
    } catch (err) {
      console.error('Fetch adoptions error:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  // Load adoptions when the component mounts
  useEffect(() => {
    fetchAdoptions();
  }, []);

  // Handle edit button click
  const handleEdit = (adoption) => {
    setEditingAdoption(adoption);
    setFormData(adoption);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Submit updated adoption
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await client.put(`/api/adoption/${editingAdoption._id}`, formData);


      setEditingAdoption(null);
      setFormData({});
      await fetchAdoptions(); // Refresh the list
    } catch (err) {
      console.error('Update adoption error:', err);
      setError(err.message);
    }
  };

  // Handle delete button click
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this adoption request?')) {
      try {
        await client.delete(`/api/adoption/${id}`);


        await fetchAdoptions(); // Refresh the list
      } catch (err) {
        console.error('Delete adoption error:', err);
        setError(err.message);
      }
    }
  };

  if (loading) return <div>Loading adoptions...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <motion.div
      className={styles.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Adoption Management</h2>
      <motion.table
        className={styles.table}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
        }}
        initial="hidden"
        animate="visible"
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Housing Type</th>
            <th>Landlord Approval</th>
            <th>Pet Type</th>
            <th>Pet Experience</th>
            <th>Home Visit</th>
            <th>Appointment Date</th>
            <th>Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {adoptions.map((a) => (
            <tr key={a._id}>
              <td>{a._id.slice(-6)}</td>
              <td>{a.userId.slice(-6)}</td>
              <td>{a.name}</td>
              <td>{a.phone}</td>
              <td>{a.address}</td>
              <td>{a.housingType}</td>
              <td>{a.landlordApproval ? 'Yes' : 'No'}</td>
              <td>{a.petType}</td>
              <td>{a.petExperience}</td>
              <td>{a.homeVisitAgreement ? 'Yes' : 'No'}</td>
              <td>{new Date(a.appointmentDate).toLocaleDateString()}</td>
              <td>{a.appointmentTime}</td>
              <td>
                <button className={styles.button} onClick={() => handleEdit(a)}>
                  Edit
                </button>
                <button className={styles.button} onClick={() => handleDelete(a._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </motion.table>

      {editingAdoption && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={styles.editForm}
        >
          <h3>Edit Adoption Request</h3>
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
              Housing Type:
              <select name="housingType" value={formData.housingType || ''} onChange={handleChange}>
                <option value="Own House">Own House</option>
                <option value="Rent">Rent</option>
              </select>
            </label>
            {formData.housingType === 'Rent' && (
              <label>
                Landlord Approval:
                <input
                  type="checkbox"
                  name="landlordApproval"
                  checked={formData.landlordApproval || false}
                  onChange={handleChange}
                />
              </label>
            )}
            <label>
              Pet Type:
              <select name="petType" value={formData.petType || ''} onChange={handleChange}>
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
              </select>
            </label>
            <label>
              Pet Experience:
              <input type="text" name="petExperience" value={formData.petExperience || ''} onChange={handleChange} />
            </label>
            <label>
              Home Visit Agreement:
              <input
                type="checkbox"
                name="homeVisitAgreement"
                checked={formData.homeVisitAgreement || false}
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
            <button type="submit" className={styles.button}>
              Save
            </button>
            <button
              type="button"
              className={styles.button}
              onClick={() => setEditingAdoption(null)}
            >
              Cancel
            </button>
          </form>
        </motion.div>
      )}

      <motion.button
        className={styles.addButton}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Add Adoption
      </motion.button>
    </motion.div>
  );
}

export default Adoption;