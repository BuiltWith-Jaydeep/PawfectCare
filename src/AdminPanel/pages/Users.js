import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from '../styles/AdminPanel.module.css';
import client from '../../api/client';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    petName: '',
    petType: '',
    breed: '',
  });

  const tableVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Fetch all users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // GET request, no headers or body
      const response = await client.get('/api/users');
      const data = response.data;
      setUsers(data);
      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Create or Update user
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editUser ? 'PUT' : 'POST';
    const url = editUser
      ? `/api/users/${editUser._id}`
      : '/api/users';

    try {
      await client({ url, method, data: formData });
      await fetchUsers(); // Refresh user list
      setShowForm(false);
      setEditUser(null);
      setFormData({
        username: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        petName: '',
        petType: '',
        breed: '',
      });
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    try {
      await client.delete(`/api/users/${id}`);
      await fetchUsers(); // Refresh user list
    } catch (err) {
      setError(err.message);
    }
  };

  // Edit user
  const handleEdit = (user) => {
    setEditUser(user);
    setFormData({ ...user, password: '' }); 
    setShowForm(true);
  };

  return (
    <motion.div
      className={styles.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1>User Management</h1>
      {loading && <p>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && !error && (
        <motion.table
          className={styles.table}
          variants={tableVariants}
          initial="hidden"
          animate="visible"
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Pet Name</th>
              <th>Pet Type</th>
              <th>Breed</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id.slice(-6)}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.address}</td>
                <td>{user.petName}</td>
                <td>{user.petType}</td>
                <td>{user.breed}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className={styles.button} onClick={() => handleEdit(user)}>
                    Edit
                  </button>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </motion.table>
      )}
     

      {showForm && (
        <motion.div
          className={styles.formOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <form onSubmit={handleSubmit} className={styles.form}>
            <h2>{editUser ? 'Edit User' : 'Add User'}</h2>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Username"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              required
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder={editUser ? 'New Password (optional)' : 'Password'}
              required={!editUser}
            />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Phone"
              required
            />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Address"
              required
            />
            <input
              type="text"
              name="petName"
              value={formData.petName}
              onChange={handleInputChange}
              placeholder="Pet Name"
              required
            />
            <select
              name="petType"
              value={formData.petType}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Pet Type</option>
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="bird">Bird</option>
              <option value="other">Other</option>
            </select>
            <input
              type="text"
              name="breed"
              value={formData.breed}
              onChange={handleInputChange}
              placeholder="Breed"
              required
            />
            <button type="submit" className={styles.button}>
              {editUser ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              className={styles.button}
              onClick={() => {
                setShowForm(false);
                setEditUser(null);
                setFormData({
                  username: '',
                  email: '',
                  password: '',
                  phone: '',
                  address: '',
                  petName: '',
                  petType: '',
                  breed: '',
                });
              }}
            >
              Cancel
            </button>
          </form>
        </motion.div>
      )}
    </motion.div>
  );
}

export default Users;