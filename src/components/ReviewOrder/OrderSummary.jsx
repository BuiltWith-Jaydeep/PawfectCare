import React from 'react';
import './OrderSummary.css';

const OrderSummary = ({ cart }) => {
  const subtotal = cart.reduce((sum, item) => sum + item.discountPrice * (item.quantity || 1), 0);
  const tax = subtotal * 0.1; 
  const shipping = 50; 
  const total = subtotal + tax + shipping;

  return (
    <section className="orderSummary">
      <h2>Order Summary</h2>
      <div className="productList">
        {cart.map((item) => (
          <div key={item.id} className="productCard">
            <img src={item.image} alt={item.name} />
            <div className="productInfo">
              <p>{item.name}</p>
              <small>Qty: {item.quantity || 1}</small>
            </div>
            <p>₹{item.discountPrice * (item.quantity || 1)}</p>
            <button className="removeBtn">✕</button>
          </div>
        ))}
      </div>
      <div className="priceBreakdown">
        <p><strong>Subtotal:</strong> ₹{subtotal}</p>
        <p><strong>Tax:</strong> ₹{tax}</p>
        <p><strong>Shipping:</strong> ₹{shipping}</p>
        <hr />
        <p className="total"><strong>Total:</strong> ₹{total}</p>
      </div>
      <div className="promoCode">
        <input type="text" placeholder="Enter promo code" />
        <button>Apply</button>
      </div>
    </section>
  );
};

export default OrderSummary;