import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./BookingForm.css";
import { useNavigate } from "react-router-dom";
import client from '../api/client';
import { useAuth } from "../context/AuthContext"; 

// Breed options
const dogBreeds = ["Labrador", "Poodle", "Bulldog", "Beagle", "German Shepherd"];
const catBreeds = ["Siamese", "Persian", "Maine Coon", "Ragdoll", "Bengal"];

// Dropdown options
const medicalHistoryOptions = [
  "None",
  "Allergies - Food",
  "Allergies - Environmental",
  "Allergies - Medication",
  "Previous Surgery - Spay/Neuter",
  "Previous Surgery - Injury Repair",
  "Previous Surgery - Dental",
  "Chronic Illness - Diabetes",
  "Chronic Illness - Heart Disease",
  "Chronic Illness - Kidney Disease",
  "Infectious Disease - Parvovirus (Dogs)",
  "Infectious Disease - Feline Leukemia (Cats)",
  "Skin Condition - Hot Spots",
  "Skin Condition - Mange",
  "Other",
];

const reasonOptions = [
  "Routine Check-up",
  "Vaccination",
  "Not Eating",
  "Vomiting",
  "Diarrhea",
  "Coughing/Sneezing",
  "Lethargy",
  "Injury",
  "Skin Issues",
  "Ear Problems",
  "Eye Problems",
  "Urinary Issues",
  "Behavioral Changes",
  "Emergency",
  "Other",
];

const behavioralNotesOptions = [
  "Friendly",
  "Calm",
  "Nervous",
  "Anxious",
  "Aggressive - People",
  "Aggressive - Other Animals",
  "Shy",
  "Hyperactive",
  "Fearful of Loud Noises",
  "Chews/Destroys Things",
  "Barks/Meows Excessively",
  "Separation Anxiety",
];

// Pricing data for dogs
const dogBasePrices = {
  "Routine Check-up": 500,
  "Vaccination": 600,
  "Not Eating": 700,
  "Vomiting": 800,
  "Diarrhea": 800,
  "Coughing/Sneezing": 700,
  "Lethargy": 750,
  "Injury": 1000,
  "Skin Issues": 900,
  "Ear Problems": 800,
  "Eye Problems": 800,
  "Urinary Issues": 900,
  "Behavioral Changes": 850,
  "Emergency": 1500,
  "Other": 700,
};

const dogBreedMultipliers = {
  "Labrador": 1.2,
  "Poodle": 1.0,
  "Bulldog": 1.1,
  "Beagle": 0.9,
  "German Shepherd": 1.3,
};

// Pricing data for cats
const catBasePrices = {
  "Routine Check-up": 400,
  "Vaccination": 500,
  "Not Eating": 600,
  "Vomiting": 650,
  "Diarrhea": 650,
  "Coughing/Sneezing": 600,
  "Lethargy": 650,
  "Injury": 900,
  "Skin Issues": 800,
  "Ear Problems": 700,
  "Eye Problems": 700,
  "Urinary Issues": 800,
  "Behavioral Changes": 750,
  "Emergency": 1400,
  "Other": 600,
};

const catBreedMultipliers = {
  "Siamese": 1.0,
  "Persian": 1.0,
  "Maine Coon": 1.2,
  "Ragdoll": 1.1,
  "Bengal": 1.0,
};

const BookingForm = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user from AuthContext using useAuth hook
  const token = localStorage.getItem('token'); // Get token from localStorage

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
    animalType: "",
    breed: "",
    age: "",
    medicalHistory: "",
    reason: "",
    behavioralNotes: "",
    consent: false,
    appointmentDate: null,
    appointmentTime: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [price, setPrice] = useState(0);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Calculate price dynamically
  useEffect(() => {
    const { animalType, breed, reason } = formData;
    if (animalType && breed && reason) {
      const basePrices = animalType === "Dog" ? dogBasePrices : catBasePrices;
      const breedMultipliers =
        animalType === "Dog" ? dogBreedMultipliers : catBreedMultipliers;
      const basePrice = basePrices[reason] || 0;
      const multiplier = breedMultipliers[breed] || 1.0;
      setPrice(basePrice * multiplier);
    } else {
      setPrice(0);
    }
  }, [formData.animalType, formData.breed, formData.reason]);

  // Validation logic
  const validate = () => {
    let tempErrors = {};
    if (!formData.name.match(/^[a-zA-Z ]+$/))
      tempErrors.name = "Name must contain only letters and spaces.";
    if (!formData.phone.match(/^\d{10}$/))
      tempErrors.phone = "Phone number must be exactly 10 digits.";
    if (!formData.address) tempErrors.address = "Address is required.";
    if (!formData.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/))
      tempErrors.email = "Invalid email format.";
    if (!formData.animalType)
      tempErrors.animalType = "Please select an animal type.";
    if (!formData.breed) tempErrors.breed = "Please select a breed.";
    if (!formData.age || formData.age <= 0)
      tempErrors.age = "Please enter a valid age.";
    if (!formData.medicalHistory)
      tempErrors.medicalHistory = "Please select a medical history option.";
    if (!formData.reason)
      tempErrors.reason = "Please select a reason for consultation.";
    if (!formData.behavioralNotes)
      tempErrors.behavioralNotes = "Please select a behavioral note.";
    if (!formData.consent)
      tempErrors.consent = "You must consent to treatment.";
    if (!formData.appointmentDate)
      tempErrors.appointmentDate = "Please select a preferred date.";
    if (!formData.appointmentTime)
      tempErrors.appointmentTime = "Please select a preferred time slot.";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user is logged in
    if (!user || !token) {
      alert("You must be logged in to book an appointment.");
      navigate("/login");
      return;
    }

    if (validate()) {
      try {
        // Prepare the data to send to the backend
        const dataToSend = {
          ...formData,
          appointmentDate: formData.appointmentDate.toISOString().split("T")[0], // Format date to YYYY-MM-DD
          estimatedPrice: price,
        };

        // Send POST request to backend
        const response = await client.post("/api/consultations",
          dataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 201) {
          setSubmitted(true);
          setTimeout(() => {
            setSubmitted(false);
            setFormData({
              name: "",
              phone: "",
              address: "",
              email: "",
              animalType: "",
              breed: "",
              age: "",
              medicalHistory: "",
              reason: "",
              behavioralNotes: "",
              consent: false,
              appointmentDate: null,
              appointmentTime: "",
            });
            onClose();
          }, 2000);
        }
      } catch (error) {
        console.error("Error booking consultation:", error);
        alert("Failed to book consultation. Please try again.");
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.5, y: "-100vh" }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: "-100vh" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Book Your Appointment</h2>
              <form onSubmit={handleSubmit}>
                {/* Client Information */}
                <motion.div className="form-group" whileHover={{ scale: 1.02 }}>
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && <span className="error">{errors.name}</span>}
                </motion.div>
                <motion.div className="form-group" whileHover={{ scale: 1.02 }}>
                  <label>Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  {errors.phone && (
                    <span className="error">{errors.phone}</span>
                  )}
                </motion.div>
                <motion.div className="form-group" whileHover={{ scale: 1.02 }}>
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                  {errors.address && (
                    <span className="error">{errors.address}</span>
                  )}
                </motion.div>
                <motion.div className="form-group" whileHover={{ scale: 1.02 }}>
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <span className="error">{errors.email}</span>
                  )}
                </motion.div>

                {/* Animal Information */}
                <motion.div className="form-group" whileHover={{ scale: 1.02 }}>
                  <label>Animal Type</label>
                  <select
                    name="animalType"
                    value={formData.animalType}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                  </select>
                  {errors.animalType && (
                    <span className="error">{errors.animalType}</span>
                  )}
                </motion.div>
                <motion.div className="form-group" whileHover={{ scale: 1.02 }}>
                  <label>Breed</label>
                  <select
                    name="breed"
                    value={formData.breed}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    {formData.animalType === "Dog" &&
                      dogBreeds.map((breed) => (
                        <option key={breed} value={breed}>
                          {breed}
                        </option>
                      ))}
                    {formData.animalType === "Cat" &&
                      catBreeds.map((breed) => (
                        <option key={breed} value={breed}>
                          {breed}
                        </option>
                      ))}
                  </select>
                  {errors.breed && (
                    <span className="error">{errors.breed}</span>
                  )}
                </motion.div>
                <motion.div className="form-group" whileHover={{ scale: 1.02 }}>
                  <label>Age of Pet</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                  />
                  {errors.age && <span className="error">{errors.age}</span>}
                </motion.div>

                {/* Medical History */}
                <motion.div className="form-group" whileHover={{ scale: 1.02 }}>
                  <label>Medical History</label>
                  <select
                    name="medicalHistory"
                    value={formData.medicalHistory}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    {medicalHistoryOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.medicalHistory && (
                    <span className="error">{errors.medicalHistory}</span>
                  )}
                </motion.div>

                {/* Reason for Consultation */}
                <motion.div className="form-group" whileHover={{ scale: 1.02 }}>
                  <label>Reason for Consultation</label>
                  <select
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    {reasonOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.reason && (
                    <span className="error">{errors.reason}</span>
                  )}
                </motion.div>

                {/* Preferred Appointment Date and Time */}
                <motion.div className="form-group" whileHover={{ scale: 1.02 }}>
                  <label>Preferred Appointment Date</label>
                  <DatePicker
                    selected={formData.appointmentDate}
                    onChange={(date) =>
                      setFormData({ ...formData, appointmentDate: date })
                    }
                    minDate={new Date(
                      new Date().setDate(new Date().getDate() + 1)
                    )}
                    dateFormat="MMMM d, yyyy"
                  />
                  {errors.appointmentDate && (
                    <span className="error">{errors.appointmentDate}</span>
                  )}
                </motion.div>
                <motion.div className="form-group" whileHover={{ scale: 1.02 }}>
                  <label>Preferred Appointment Time</label>
                  <select
                    name="appointmentTime"
                    value={formData.appointmentTime}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="9 to 12">9 AM to 12 PM</option>
                    <option value="1 to 4">1 PM to 4 PM</option>
                    <option value="4 to 7">4 PM to 7 PM</option>
                  </select>
                  {errors.appointmentTime && (
                    <span className="error">{errors.appointmentTime}</span>
                  )}
                </motion.div>

                {/* Behavioral Notes */}
                <motion.div className="form-group" whileHover={{ scale: 1.02 }}>
                  <label>Behavioral Notes</label>
                  <select
                    name="behavioralNotes"
                    value={formData.behavioralNotes}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    {behavioralNotesOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.behavioralNotes && (
                    <span className="error">{errors.behavioralNotes}</span>
                  )}
                </motion.div>

                {/* Price Display */}
                <motion.div className="price-display" whileHover={{ scale: 1.02 }}>
                  <h3>Estimated Price: Rs. {price.toFixed(0)}</h3>
                </motion.div>

                {/* Consent Checkbox */}
                <motion.div
                  className="form-group checkbox"
                  whileHover={{ scale: 1.02 }}
                >
                  <input
                    type="checkbox"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleChange}
                  />
                  <label>Yes, you can treat my pet.</label>
                  {errors.consent && (
                    <span className="error">{errors.consent}</span>
                  )}
                </motion.div>

                {/* Buttons */}
                <div className="form-buttons">
                  <motion.button
                    type="submit"
                    className="submit-button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Submit
                  </motion.button>
                  <motion.button
                    type="button"
                    className="cancel-button"
                    onClick={onClose}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>

          {/* Notification  */}
          <AnimatePresence>
            {submitted && (
              <motion.div
                className="notification"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3 }}
              >
                Appointment Booked Successfully!
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};

export default BookingForm;