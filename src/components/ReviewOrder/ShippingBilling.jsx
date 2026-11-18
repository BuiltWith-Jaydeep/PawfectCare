import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './ShippingBilling.css';
import client from '../../api/client';

const ShippingBilling = () => {
  const { user } = useAuth(); // Get user from AuthContext
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user || !user.email) return; 

      try {
        const response = await client.get('/api/users/me');
        const data = response.data;
        setShippingInfo({
          name: data.username || 'Not provided',
          email: data.email || 'Not provided',
          phone: data.phone || 'Not provided',
          address: data.address || 'Not provided',
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        setShippingInfo({
          name: user.username || 'Not provided',
          email: user.email || 'Not provided',
          phone: user.phone || 'Not provided',
          address: user.address || 'Not provided',
        });
      }
    };

    fetchUserData();
  }, [user]);

  const handleCheckboxChange = (e) => {
    setBillingSameAsShipping(e.target.checked);
  };

  return (
    <section className="shippingBilling">
      <h2>Shipping & Billing Information</h2>
      <div className="addressContainer">
        {/* Shipping Address */}
        <div className="addressCard">
          <h3>Shipping Address</h3>
          <p>{shippingInfo.name}</p>
          <p><a href={`mailto:${shippingInfo.email}`}>{shippingInfo.email}</a></p>
          <p><a href={`tel:${shippingInfo.phone}`}>{shippingInfo.phone}</a></p>
          <p>{shippingInfo.address}</p>
          <span className="editIcon">✎</span>
        </div>

        {/* Billing Address */}
        <div className="addressCard">
          <h3>Billing Address</h3>
          <label className="billingToggle">
            <input
              type="checkbox"
              checked={billingSameAsShipping}
              onChange={handleCheckboxChange}
            /> Same as shipping
          </label>
          <p>{billingSameAsShipping ? shippingInfo.name : 'Not provided'}</p>
          <p>{billingSameAsShipping ? <a href={`mailto:${shippingInfo.email}`}>{shippingInfo.email}</a> : 'Not provided'}</p>
          <p>{billingSameAsShipping ? <a href={`tel:${shippingInfo.phone}`}>{shippingInfo.phone}</a> : 'Not provided'}</p>
          <p>{billingSameAsShipping ? shippingInfo.address : 'Not provided'}</p>
          <span className="editIcon">✎</span>
        </div>
      </div>
    </section>
  );
};

export default ShippingBilling;