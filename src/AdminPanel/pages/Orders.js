import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from '../styles/AdminPanel.module.css';
import client from '../../api/client';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [formData, setFormData] = useState({ status: '' });

  // Fetch all orders from backend
  const fetchOrders = async () => {
    try {
      const response = await client.get('/api/orders');


      const data = response.data;
      setOrders(data);
      setLoading(false);
    } catch (err) {
      console.error('Fetch orders error:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  // Load orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle edit button click
  const handleEdit = (order) => {
    setEditingOrder(order);
    setFormData({ status: order.status });
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit updated order
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await client.put(`/api/orders/update/${editingOrder._id}`, formData);


      setEditingOrder(null);
      setFormData({ status: '' });
      await fetchOrders(); // Refresh orders
    } catch (err) {
      console.error('Update order error:', err);
      setError(err.message);
    }
  };

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <motion.div
      className={styles.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1>Order Management</h1>
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
            <th>Order ID</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>Status</th>
            <th>Products</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id.slice(-6)}</td>
              <td>{order.userId.slice(-6)}</td>
              <td>{order.orderId.slice(0, 10)}...</td>
              <td>₹{order.amount}</td>
              <td>{order.currency.toUpperCase()}</td>
              <td>{order.status}</td>
              <td>
                {order.products.map((p) => (
                  <div key={p.productId}>{p.name} (x{p.quantity})</div>
                ))}
              </td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>
                <button className={styles.button} onClick={() => handleEdit(order)}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </motion.table>

      {editingOrder && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={styles.editForm}
        >
          <h2>Edit Order: {editingOrder.orderId.slice(0, 10)}...</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Status:
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </label>
            <button type="submit" className={styles.button}>
              Save
            </button>
            <button
              type="button"
              className={styles.button}
              onClick={() => setEditingOrder(null)}
            >
              Cancel
            </button>
          </form>
        </motion.div>
      )}
    </motion.div>
  );
}

export default Orders;