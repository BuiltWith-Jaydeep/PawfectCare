import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const Subscription = () => {
  const { user, isAuthenticated } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [billingHistory, setBillingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBillingHistory, setShowBillingHistory] = useState(false);

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      if (!isAuthenticated || !user || !user.id) {
        setError('Please log in to view your subscription.');
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        // Fetch subscription data
        const subscriptionResponse = await fetch(
          `${process.env.REACT_APP_API_URL}/api/subscriptions/user/${user.id}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!subscriptionResponse.ok) {
          const errorText = await subscriptionResponse.text();
          if (subscriptionResponse.status === 404) {
            setSubscription(null); // No subscription found
          } else {
            throw new Error(`Failed to fetch subscription: ${errorText}`);
          }
        } else {
          const subscriptionData = await subscriptionResponse.json();
          console.log('Fetched subscription data:', subscriptionData); // Debug log
          // Handle different possible response structures
          if (Array.isArray(subscriptionData) && subscriptionData.length > 0) {
            setSubscription(subscriptionData[0]); // Take the first subscription if array
          } else if (subscriptionData && Object.keys(subscriptionData).length > 0) {
            setSubscription(subscriptionData); // Use object directly if not array
          } else {
            setSubscription(null); // No valid subscription data
          }
        }

        // Fetch billing history
        const billingResponse = await fetch(
          `${process.env.REACT_APP_API_URL}/api/payments/user/${user.id}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!billingResponse.ok) {
          const errorText = await billingResponse.text();
          throw new Error(`Failed to fetch billing history: ${errorText}`);
        }
        const billingData = await billingResponse.json();
        setBillingHistory(Array.isArray(billingData) ? billingData : []);
      } catch (err) {
        console.error('Subscription fetch error:', err);
        setError(err.message || 'An unexpected error occurred while fetching subscription data.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [isAuthenticated, user]);

  // Loading state
  if (loading) {
    return <div style={styles.loading}>Loading your subscription details...</div>;
  }

  // Error state
  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  // No subscription state
  if (!subscription) {
    return (
      <div style={styles.noSubscription}>
        <h2 style={styles.noSubscriptionTitle}>No Subscription Yet!</h2>
        <p style={styles.noSubscriptionText}>
          Unlock exclusive benefits by subscribing to one of our plans.{' '}
          <Link to="/services" style={styles.link} aria-label="Explore Services">
            Explore Services
          </Link>
        </p>
      </div>
    );
  }

  // Check subscription status
  const isActive = () => {
    if (!subscription.paymentDate) return false;
    const paymentDate = new Date(subscription.paymentDate);
    const oneMonthLater = new Date(paymentDate);
    oneMonthLater.setMonth(paymentDate.getMonth() + 1);
    return new Date() < oneMonthLater;
  };

  const cardStyle = {
    ...styles.subscriptionCard,
    borderColor: isActive() ? '#34C759' : '#FFA500',
  };

  return (
    <div style={styles.container}>
      <div style={cardStyle}>
        <h3 style={styles.planName}>{subscription.plan || 'Unknown Plan'}</h3>
        <ul style={styles.planDetails}>
          {subscription.planDetails && Object.keys(subscription.planDetails).length > 0 ? (
            Object.entries(subscription.planDetails).map(([key, value]) => (
              <li key={key} style={styles.planItem}>
                {`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`}
              </li>
            ))
          ) : (
            <li style={styles.planItem}>No plan details available</li>
          )}
        </ul>
        <p style={styles.paymentDate}>
          Payment Date:{' '}
          {subscription.paymentDate
            ? new Date(subscription.paymentDate).toLocaleDateString()
            : 'Not available'}
        </p>
      </div>
      <div style={styles.billingHistory}>
        <button
          style={styles.toggleButton}
          onClick={() => setShowBillingHistory(!showBillingHistory)}
          aria-expanded={showBillingHistory}
          aria-label="Toggle Billing History"
        >
          {showBillingHistory ? 'Hide Billing History' : 'Show Billing History'}
        </button>
        {showBillingHistory && (
          <ul style={styles.billingList}>
            {billingHistory.length > 0 ? (
              billingHistory.map((payment, index) => (
                <li key={index} style={styles.billingItem}>
                  {payment.date
                    ? new Date(payment.date).toLocaleDateString()
                    : 'Unknown Date'}{' '}
                  - ₹{payment.amount || 'N/A'}
                </li>
              ))
            ) : (
              <li style={styles.billingItem}>No billing history available</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    maxWidth: '100%',
    boxSizing: 'border-box',
  },
  loading: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#666',
    padding: '20px',
  },
  error: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#e63946',
    padding: '20px',
  },
  noSubscription: {
    textAlign: 'center',
    padding: '50px',
  },
  noSubscriptionTitle: {
    fontSize: '24px',
    color: '#14B8A6',
    marginBottom: '10px',
  },
  noSubscriptionText: {
    fontSize: '16px',
    color: '#666',
  },
  link: {
    color: '#14B8A6',
    textDecoration: 'none',
    fontWeight: 600,
  },
  subscriptionCard: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    border: '2px solid',
    marginBottom: '20px',
  },
  planName: {
    fontSize: '22px',
    fontWeight: 600,
    color: '#14B8A6',
    marginBottom: '15px',
  },
  planDetails: {
    listStyle: 'none',
    padding: 0,
    marginBottom: '15px',
  },
  planItem: {
    fontSize: '16px',
    color: '#333',
    marginBottom: '5px',
  },
  paymentDate: {
    fontSize: '14px',
    color: '#666',
  },
  billingHistory: {
    marginTop: '20px',
  },
  toggleButton: {
    padding: '10px 20px',
    backgroundColor: '#14B8A6',
    color: '#fff',
    border: 'none',
    borderRadius: '25px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 600,
  },
  billingList: {
    listStyle: 'none',
    padding: '0',
    marginTop: '10px',
  },
  billingItem: {
    fontSize: '16px',
    color: '#333',
    marginBottom: '5px',
  },
};

export default Subscription;