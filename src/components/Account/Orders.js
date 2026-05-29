import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productImages } from '../../pages/ShopPage/productImages'; 
import Modal from 'react-modal';
import toast, { Toaster } from 'react-hot-toast';
import ProgressBar from '@ramonak/react-progress-bar';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/orders/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        setOrders(data);
        setSuccess(data.length > 0 ? '' : '');
      } catch (err) {
        setError(err.message || 'Error fetching orders');
      }
    };
    fetchOrders();
  }, []);

  // Format date for display
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${formattedDate} ${hours}:${minutes}`;
  };

  // Calculate days since order
  const daysSince = (date) => {
    const createdDate = new Date(date);
    const today = new Date();
    const diffTime = today - createdDate;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  // Determine tracking status
  const getTrackingStep = (createdAt) => {
    const days = daysSince(createdAt);
    if (days >= 4) return 'Delivered';
    if (days >= 3) return 'Out for Delivery';
    if (days >= 2) return 'Shipped';
    return 'Ordered';
  };

  // Open tracking modal
  const openTrackingModal = (order, product) => {
    setSelectedOrder(order);
    setSelectedProduct(product);
    setTrackingModalOpen(true);
  };

  // Open details modal
  const openDetailsModal = (order, product) => {
    setSelectedOrder(order);
    setSelectedProduct(product);
    setDetailsModalOpen(true);
  };

  // Close modals
  const closeModals = () => {
    setTrackingModalOpen(false);
    setDetailsModalOpen(false);
    setSelectedOrder(null);
    setSelectedProduct(null);
  };

  // Empty state
  if (orders.length === 0 && !error) {
    return (
      <div style={styles.noOrdersContainer}>
        <h3 style={styles.noOrdersTitle}>Your Cart Looks Like a Ghost Town! 👻</h3>
        <p style={styles.noOrdersText}>
          No paws have shopped yet! Unleash some love—head to the shop now!
        </p>
        <Link to="/shop" style={styles.shopButton}>
          Explore the Shop Now 🐾
        </Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Toaster /> {/*toast notifications */}
      {error && <div style={styles.error}>{error}</div>}
      {success && <div style={styles.success}>{success}</div>}
      {orders.map((order) =>
        order.products.map((product, index) => {
          const status = daysSince(order.createdAt) < 4 ? 'pending' : 'completed';
          const statusColor = status === 'pending' ? '#e63946' : '#34C759';
          const canCancel = daysSince(order.createdAt) < 1;

          return (
            <div key={`${order.orderId}-${index}`} style={styles.orderCard}>
              <div style={styles.productRow}>
                <img
                  src={productImages[product.name] || 'https://via.placeholder.com/80'}
                  alt={product.name}
                  style={styles.image}
                />
                <div style={styles.info}>
                  <h3 style={styles.productName}>{product.name}</h3>
                  <p style={styles.detail}>Ordered: {formatDate(order.createdAt)}</p>
                  <p style={styles.detail}>
                    Status: <span style={{ color: statusColor }}>{status}</span>
                  </p>
                </div>
              </div>
              <div style={styles.actions}>
                <button style={styles.button} onClick={() => openTrackingModal(order, product)}>
                  Track Package
                </button>
                <button
                  style={{ ...styles.buttonSecondary, opacity: canCancel ? 1 : 0.5 }}
                  disabled={!canCancel}
                  onClick={() => toast.success('Cancellation requested!')}
                >
                  Request Cancellation
                </button>
                <button style={styles.button} onClick={() => openDetailsModal(order, product)}>
                  View Details
                </button>
              </div>
            </div>
          );
        })
      )}

      {/* Tracking Modal */}
      <Modal isOpen={trackingModalOpen} onRequestClose={closeModals} style={modalStyles}>
        <h2>Order Tracking</h2>
        <div style={{ margin: '20px 0' }}>
          <ProgressBar
            completed={getProgressValue(getTrackingStep(selectedOrder?.createdAt))}
            bgColor="#14B8A6"
            height="20px"
            labelAlignment="center"
            labelColor="#fff"
          />
        </div>
        <div style={styles.statusSteps}>
          {['Ordered', 'Shipped', 'Out for Delivery', 'Delivered'].map((step, index) => (
            <div
              key={index}
              style={{
                ...styles.step,
                color: index <= getStepIndex(getTrackingStep(selectedOrder?.createdAt)) ? '#14B8A6' : '#ccc',
              }}
            >
              {step}
            </div>
          ))}
        </div>
        <button onClick={closeModals} style={styles.closeButton}>Close</button>
      </Modal>

      {/* Details Modal */}
      <Modal isOpen={detailsModalOpen} onRequestClose={closeModals} style={modalStyles}>
  <h2>Order Details</h2>
  <p><strong>Payment Intent ID:</strong> <span style={{ color: '#333' }}>{selectedOrder?.paymentIntentId}</span></p>
  <p><strong>Product:</strong> <span style={{ color: '#333' }}>{selectedProduct?.name}</span></p>
  <p><strong>Price:</strong> <span style={{ color: '#333' }}>₹{selectedProduct?.price}</span></p>
  <p><strong>Quantity:</strong> <span style={{ color: '#333' }}>{selectedProduct?.quantity}</span></p>
  <p><strong>Order Date:</strong> <span style={{ color: '#333' }}>{formatDate(selectedOrder?.createdAt)}</span></p>
  <button onClick={closeModals} style={styles.closeButton}>Close</button>
</Modal>
    </div>
  );
};

// Helper functions
const getProgressValue = (step) => {
  const steps = { Ordered: 25, Shipped: 50, 'Out for Delivery': 75, Delivered: 100 };
  return steps[step] || 0;
};

const getStepIndex = (step) => {
  const steps = ['Ordered', 'Shipped', 'Out for Delivery', 'Delivered'];
  return steps.indexOf(step);
};

// Styles
const styles = {
  container: { padding: '20px' },
  noOrdersContainer: { textAlign: 'center', padding: '50px' },
  noOrdersTitle: { fontSize: '24px', marginBottom: '10px' },
  noOrdersText: { fontSize: '16px', marginBottom: '20px' },
  shopButton: {
    padding: '10px 20px',
    backgroundColor: '#14B8A6',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '25px',
  },
  orderCard: {
    border: '1px solid #ddd',
    padding: '15px',
    marginBottom: '15px',
    borderRadius: '8px',
  },
  productRow: { display: 'flex', alignItems: 'center' },
  image: { width: '80px', height: '80px', marginRight: '15px' },
  info: { flex: 1 },
  productName: { fontSize: '18px', margin: '0 0 5px' },
  detail: { margin: '5px 0', color: '#555' },
  actions: { display: 'flex', gap: '10px', marginTop: '10px' },
  button: {
    padding: '8px 15px',
    backgroundColor: '#14B8A6',
    color: '#fff',
    border: 'none',
    borderRadius: '25px',
    cursor: 'pointer',
  },
  buttonSecondary: {
    padding: '8px 15px',
    backgroundColor: '#fff',
    color: '#14B8A6',
    border: '1px solid #14B8A6',
    borderRadius: '25px',
    cursor: 'pointer',
  },
  error: { color: 'red', marginBottom: '10px' },
  success: { color: 'green', marginBottom: '10px' },
  statusSteps: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  },
  step: { fontSize: '16px', fontWeight: 600 },
  closeButton: {
    padding: '10px 20px',
    backgroundColor: '#14B8A6',
    color: '#fff',
    border: 'none',
    borderRadius: '25px',
    cursor: 'pointer',
    marginTop: '20px',
  },
};

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    padding: '20px',
    borderRadius: '12px',
  },
};

export default Orders;