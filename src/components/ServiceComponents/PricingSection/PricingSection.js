import React from "react";
import { useInView } from "react-intersection-observer";
import "./PricingSection.css";
import client from '../../../api/client';

const PricingSection = () => {
  // Hooks for scroll-triggered animations
  const [textRef, textInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [card1Ref, card1InView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [card2Ref, card2InView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [card3Ref, card3InView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [keyFeaturesRef, keyFeaturesInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  // Function to handle subscription checkout
  const handleOrderNow = async (priceId) => {
    try {
      const token = localStorage.getItem("token"); // Get JWT token from localStorage
      if (!token) {
        alert("Please log in to subscribe!");
        return;
      }

      const response = await client.post("/api/subscription/create-checkout-session",
        { priceId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.href = response.data.url; // Redirect to Stripe checkout
    } catch (error) {
      console.error("Error creating checkout session:", error);
      alert("Something went wrong. Please try again!");
    }
  };

  return (
    <section className="pricing-section">
      {/* Header Section */}
      <div
        ref={textRef}
        className={`section-divider ${textInView ? "animate" : ""}`}
      >
        <div className="divider-content">
          <h2 className="sub-heading">Our Affordable Rates</h2>
          <h1 className="main-heading">
            <span className="highlight">Pricing</span> Plans
          </h1>
        </div>
      </div>

      {/* Pricing Cards and Key Features Container */}
      <div className="pricing-container">
        <div className="pricing-cards">
          {/* Basic Care Plan */}
          <div
            ref={card1Ref}
            className={`pricing-card basic ${card1InView ? "animate" : ""}`}
            style={{ backgroundColor: "#564741" }}
          >
            <h3 className="plan-name">Basic Care Plan</h3>
            <div className="price">₹799 <span className="price-suffix">/month</span></div>
            <ul className="services-list">
              <li>Veterinary: 1 video consultation/month</li>
              <li>Grooming: 1 basic bath/month (₹599 value)</li>
              <li>Vaccination: 10% discount on shots</li>
              <li>Adoption: Basic paperwork support</li>
              <li className="missing-feature">✖ No boarding credits</li>
              <li className="missing-feature">✖ Limited vet access</li>
            </ul>
            <button
              className="order-now-button"
              onClick={() => handleOrderNow("price_1R7UhrCKarIwe4RcC2ycP5Fa")}
            >
              Order Now
            </button>
          </div>

          {/* Premium Care Plan */}
          <div
            ref={card2Ref}
            className={`pricing-card premium ${card2InView ? "animate" : ""}`}
            style={{ backgroundColor: "#989797" }}
          >
            <h3 className="plan-name">Premium Care Plan</h3>
            <div className="price">₹2,499 <span className="price-suffix">/month</span></div>
            <ul className="services-list">
              <li>Veterinary: 3 consultations (2 online + 1 clinic)</li>
              <li>Grooming: Full trim + bath monthly (₹1,257 value)</li>
              <li>Boarding: 24-hr stay credit/month (₹899 value)</li>
              <li>Vaccination: 25% discount + annual reminder</li>
              <li>Adoption: Priority shelter access</li>
              <li>Bonus: Free health checkup quarterly</li>
            </ul>
            <button
              className="order-now-button"
              onClick={() => handleOrderNow("price_1R7UkZCKarIwe4RcCUQWWvvs")}
            >
              Order Now
            </button>
          </div>

          {/* Ultimate Care Plan */}
          <div
            ref={card3Ref}
            className={`pricing-card ultimate ${card3InView ? "animate" : ""}`}
            style={{ backgroundColor: "#27304B" }}
          >
            <h3 className="plan-name">Ultimate Care Plan</h3>
            <div className="price">₹4,999 <span className="price-suffix">/month</span></div>
            <ul className="services-list">
              <li>Veterinary: Unlimited teleconsultations + 2 clinic visits</li>
              <li>Grooming: Premium spa grooming every 15 days</li>
              <li>Boarding: 3 daycare sessions/month (₹2,397 value)</li>
              <li>Vaccination: Full coverage package (₹2,300 value)</li>
              <li>Adoption: Dedicated concierge + certification</li>
              <li>Bonus: Free pet insurance consultation</li>
            </ul>
            <button
              className="order-now-button"
              onClick={() => handleOrderNow("price_1R7UmVCKarIwe4RcmKaaTIWJ")}
            >
              Order Now
            </button>
          </div>
        </div>

        {/* Key Features Section */}
        <div
          ref={keyFeaturesRef}
          className={`key-features ${keyFeaturesInView ? "animate" : ""}`}
        >
          <h4>Key Features Across All Plans</h4>
          <ul>
            <li>All prices GST-inclusive</li>
            <li>Auto-renewal discounts (10% quarterly/15% annual)</li>
            <li>Service credits never expire</li>
            <li>Cat plans priced 20% lower across tiers</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;