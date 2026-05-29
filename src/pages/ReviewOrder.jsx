import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/ReviewOrder/Header';
import OrderSummary from '../components/ReviewOrder/OrderSummary';
import ShippingBilling from '../components/ReviewOrder/ShippingBilling';
import OrderReview from '../components/ReviewOrder/OrderReview';
import CallToAction from '../components/ReviewOrder/CallToAction';
import Footer from '../components/ReviewOrder/Footer';
import styles from './ReviewOrder.module.css';

const ReviewOrder = () => {
  const location = useLocation();
  const { cart = [], user = {} } = location.state || {}; 

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main className={styles.container}>
        {cart.length === 0 ? (
          <p>Your cart is empty. Go back to the shop to add items!</p>
        ) : (
          <>
            <OrderSummary cart={cart} />
            <ShippingBilling user={user} />
            <OrderReview cart={cart} user={user} />
            <CallToAction />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ReviewOrder;