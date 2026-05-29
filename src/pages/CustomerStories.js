import React, { useState } from 'react';
import '../../src/pages/CustomerStories.scss';

const CustomerStories = () => {
  const [hoveredPet, setHoveredPet] = useState(null);

  return (
    <div className="customer-stories">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="parallax-bg">
          <div className="floating-icon pet1"></div>
          <div className="floating-icon pet2"></div>
          <div className="floating-icon pet3"></div>
        </div>
        <div className="overlay-text">
          <h1>Pawsitive Outcomes, Tails of Trust</h1>
          <p>Discover the Heartwarming Stories of Our Furry Friends</p>
        </div>
        <button className="cta-button">Watch Whisker’s Recovery Journey</button>
      </section>

      {/* Service-Based Story Sections */}
      <section className="service-stories">
        {/* Veterinary Consultation Stories */}
        <div className="service-panel veterinary">
          <h2>Veterinary Consultation Stories</h2>
          <p className="subtitle">Tales of Healing and Hope</p>
          <div className="stories">
            <div className="story fade-in delay-1">
              <h3>Max’s Miracle Recovery</h3>
              <p>
                Max, a 3-year-old Golden Retriever, was brought to PawfectCare after a serious accident. Our emergency team sprang into action, providing round-the-clock care. After weeks of treatment and rehabilitation, Max made a full recovery. His wagging tail and joyful barks are a testament to the dedication of our veterinary staff.
              </p>
            </div>
            <div className="story fade-in delay-2">
              <h3>Bella’s Brave Battle</h3>
              <p>
                Bella, a courageous tabby cat, was diagnosed with a rare illness. Our specialists designed a personalized treatment plan, and with the love of her family and our team's expertise, Bella fought bravely. Today, she's healthy and playful, a true inspiration to all.
              </p>
            </div>
            <div className="story fade-in delay-3">
              <h3>Charlie’s Checkup Cheer</h3>
              <p>
                Charlie, a lively Beagle, used to dread vet visits. But at PawfectCare, our friendly staff and gentle approach turned his fear into excitement. Now, Charlie looks forward to his checkups, knowing he'll get treats and belly rubs. His owner is thrilled with the positive change.
              </p>
            </div>
          </div>
        </div>

        {/* Grooming Services Showcase */}
        <div className="service-panel grooming">
          <h2>Grooming Services Showcase</h2>
          <p className="subtitle">From Shaggy to Chic</p>
          <div className="before-after-slider">
            <div className="before">
              <img src="/assets/images/grooming/before.jpg" alt="Before Grooming" />
            </div>
            <div className="after">
              <img src="/assets/images/grooming/after.jpg" alt="After Grooming" />
            </div>
          </div>
          <div className="story-content">
            <h3>Luna’s Glow-Up</h3>
            <p>
              Luna, a fluffy Persian cat, transformed from a matted mess to a sleek beauty with our expert grooming
              services. Her owner couldn’t stop smiling!
            </p>
          </div>
        </div>

        {/* Pet Adoption Stories */}
        <div className="service-panel adoption">
          <h2>Pet Adoption Stories</h2>
          <p className="subtitle">Finding Forever Homes</p>
          <div className="adoption-map">
            <img src="/assets/images/map/adoption-map.jpg" alt="Adoption Locations" />
          </div>
          <div className="story-content">
            <h3>Buddy’s New Beginning</h3>
            <p>
              Buddy, a shy rescue pup, found his forever home through PawfectCare’s adoption program. His new family
              shares their joy in this heartwarming tale.
            </p>
          </div>
        </div>

        {/* Boarding/Daycare Diaries */}
        <div className="service-panel boarding">
          <h2>Boarding & Daycare Diaries</h2>
          <p className="subtitle">A Home Away from Home</p>
          <div className="kennel-tour">
            <video src="/assets/videos/kennel-tour.mp4" muted autoPlay loop playsInline></video>
          </div>
          <div className="story-content">
            <h3>Rocky’s Vacation</h3>
            <p>
              Rocky spent a week in our luxury boarding suites while his owners traveled. Check out his daily adventures
              in our daycare!
            </p>
          </div>
        </div>

        {/* Vaccination Tracker Stories */}
        <div className="service-panel vaccination">
          <h2>Vaccination Tracker Stories</h2>
          <p className="subtitle">Keeping Pets Safe</p>
          <div className="vaccination-timeline">
            <div className="timeline-item">
              <span>Jan 2023</span>
              <p>Rabies Shot</p>
            </div>
            <div className="timeline-item">
              <span>Mar 2023</span>
              <p>Distemper Vaccine</p>
            </div>
            <div className="timeline-item">
              <span>Jun 2023</span>
              <p>Booster Shot</p>
            </div>
          </div>
          <div className="story-content">
            <h3>Bella’s Health Journey</h3>
            <p>
              Bella’s vaccination tracker kept her protected all year round. Her owner shares how easy it was to stay on
              top of her health!
            </p>
          </div>
        </div>
      </section>

      {/* Social Proof Matrix */}
      <section className="social-proof">
        <h2>What People Are Saying</h2>
        <div className="brand-logos">
          <img src="/assets/images/logos/vet-partner1.png" alt="Partner 1" />
          <img src="/assets/images/logos/vet-partner2.png" alt="Partner 2" />
          <img src="/assets/images/logos/vet-partner3.png" alt="Partner 3" />
        </div>
        <div className="notifications">
          <p>Sarah just booked a grooming session for Mittens!</p>
          <p>John adopted a new pup named Rex!</p>
        </div>
        <div className="trust-wall">
          <div className="trust-item">
            <p>12K+</p>
            <span>Vaccines Administered</span>
          </div>
          <div className="trust-item">
            <p>4.9/5</p>
            <span>Paws Rating</span>
          </div>
          <div className="trust-item">
            <p>8K+</p>
            <span>Happy Pets</span>
          </div>
        </div>
      </section>

      {/* Community Impact Section */}
      <section className="community-impact">
        <h2>Our Community Impact</h2>
        <div className="donation-thermometer">
          <svg width="100" height="400">
            <rect x="40" y="50" width="20" height="300" fill="#e0e0e0" />
            <rect x="40" y="150" width="20" height="200" fill="#ff6f61" className="fill-animation" />
            <text x="50" y="40" textAnchor="middle">Goal: $10K</text>
            <text x="50" y="370" textAnchor="middle">Raised: $7K</text>
          </svg>
        </div>
        <div className="volunteer-carousel">
          <div className="carousel-item">
            <img src="/assets/images/volunteers/volunteer1.jpg" alt="Volunteer 1" />
            <p>Emily: “Volunteering at PawfectCare changed my life!”</p>
          </div>
          <div className="carousel-item">
            <img src="/assets/images/volunteers/volunteer2.jpg" alt="Volunteer 2" />
            <p>Mike: “I love helping pets find homes!”</p>
          </div>
        </div>
        <div className="foster-profile">
          <h3>Foster Hero: Jane Doe</h3>
          <img src="/assets/images/fosters/jane.jpg" alt="Jane Doe" />
          <p>
            Jane has fostered 15 pets this year, giving them love and care until they found their forever homes.
          </p>
        </div>
      </section>

      {/* Story Submission Portal */}
      <section className="story-submission">
        <h2>Share Your Story</h2>
        <form>
          <div className="form-group">
            <label htmlFor="pet-name">Pet’s Name</label>
            <input type="text" id="pet-name" placeholder="e.g., Whiskers" />
          </div>
          <div className="form-group avatar-builder">
            <label>Build Your Pet Avatar</label>
            <select>
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="bird">Bird</option>
            </select>
            <div className="avatar-preview">
              <img src="/assets/images/d5.jpg" alt="Avatar Preview" />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="story">Your Story</label>
            <textarea id="story" placeholder="Tell us about your pet’s journey..."></textarea>
          </div>
          <button type="submit">Submit Your Story</button>
        </form>
      </section>
    </div>
  );
};

export default CustomerStories;