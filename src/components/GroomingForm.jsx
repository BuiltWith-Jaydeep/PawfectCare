import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./BookingForms.css"; 
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; 

// Breed options
const dogBreeds = ["Labrador", "Poodle", "Bulldog", "Beagle", "German Shepherd"];
const catBreeds = ["Siamese", "Persian", "Maine Coon", "Ragdoll", "Bengal"];

// Dropdown options
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

const coatTypeOptions = [
  "Short and Smooth",
  "Short and Dense",
  "Medium-Length Coat",
  "Long and Silky",
  "Long and Thick",
  "Curly and Wavy",
  "Wiry and Rough",
  "Double Coat (Thick Undercoat)",
  "Hairless or Very Short Coat",
];

const groomingPreferenceOptions = [
  "Full Body Trim",
  "Short Summer Cut",
  "Breed-Specific Cut",
  "Hygiene Trim (face, paws, sanitary area)",
  "Deshedding Treatment",
  "Mat Removal",
  "Nail Trim Only",
  "Bath & Blow Dry",
  "Ear Cleaning",
  "Teeth Brushing",
  "Flea/Tick Bath",
  "Medicated Bath (for skin conditions)",
];

// Pricing data
const breedBasePrices = {
  Dog: {
    "Labrador": 600,
    "Poodle": 700,
    "Bulldog": 650,
    "Beagle": 600,
    "German Shepherd": 750,
  },
  Cat: {
    "Siamese": 500,
    "Persian": 550,
    "Maine Coon": 600,
    "Ragdoll": 580,
    "Bengal": 550,
  },
};

const coatTypeSurcharges = {
  "Short and Smooth": 0,
  "Short and Dense": 50,
  "Medium-Length Coat": 100,
  "Long and Silky": 150,
  "Long and Thick": 200,
  "Curly and Wavy": 150,
  "Wiry and Rough": 100,
  "Double Coat (Thick Undercoat)": 250,
  "Hairless or Very Short Coat": 0,
};

const groomingPreferenceCharges = {
  "Full Body Trim": 300,
  "Short Summer Cut": 250,
  "Breed-Specific Cut": 350,
  "Hygiene Trim (face, paws, sanitary area)": 150,
  "Deshedding Treatment": 200,
  "Mat Removal": 250,
  "Nail Trim Only": 100,
  "Bath & Blow Dry": 200,
  "Ear Cleaning": 80,
  "Teeth Brushing": 70,
  "Flea/Tick Bath": 180,
  "Medicated Bath (for skin conditions)": 220,
};

const GroomingForm = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user from AuthContext
  const token = localStorage.getItem('token'); // Get token from localStorage

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
    animalType: "",
    breed: "",
    age: "",
    behavioralNotes: "",
    coatType: "",
    groomingPreference: "",
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
    const { animalType, breed, coatType, groomingPreference } = formData;
    if (animalType && breed && coatType && groomingPreference) {
      const basePrice = breedBasePrices[animalType][breed] || 0;
      const coatSurcharge = coatTypeSurcharges[coatType] || 0;
      const preferenceCharge = groomingPreferenceCharges[groomingPreference] || 0;
      setPrice(basePrice + coatSurcharge + preferenceCharge);
    } else {
      setPrice(0);
    }
  }, [formData.animalType, formData.breed, formData.coatType, formData.groomingPreference]);

  // Validation logic
  const validate = () => {
    let tempErrors = {};
    if (!formData.name.match(/^[a-zA-Z ]+$/)) tempErrors.name = "Name must contain only letters and spaces.";
    if (!formData.phone.match(/^\d{10}$/)) tempErrors.phone = "Phone number must be exactly 10 digits.";
    if (!formData.address) tempErrors.address = "Address is required.";
    if (!formData.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) tempErrors.email = "Invalid email format.";
    if (!formData.animalType) tempErrors.animalType = "Please select an animal type.";
    if (!formData.breed) tempErrors.breed = "Please select a breed.";
    if (!formData.age || formData.age <= 0) tempErrors.age = "Please enter a valid age.";
    if (!formData.behavioralNotes) tempErrors.behavioralNotes = "Please select a behavioral note.";
    if (!formData.coatType) tempErrors.coatType = "Please select a coat type.";
    if (!formData.groomingPreference) tempErrors.groomingPreference = "Please select a grooming preference.";
    if (!formData.consent) tempErrors.consent = "You must consent to grooming.";
    if (!formData.appointmentDate) tempErrors.appointmentDate = "Please select a preferred date.";
    if (!formData.appointmentTime) tempErrors.appointmentTime = "Please select a preferred time slot.";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user is logged in
    if (!user || !token) {
      alert("You must be logged in to book a grooming appointment.");
      navigate("/login");
      return;
    }

    if (validate()) {
      try {
        // Prepare data for backend
        const dataToSend = {
          ...formData,
          appointmentDate: formData.appointmentDate.toISOString().split("T")[0], // Format to YYYY-MM-DD
          estimatedPrice: price,
        };

        // Send POST request to backend
        const response = await axios.post(
          "http://localhost:5000/api/grooming",
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
              behavioralNotes: "",
              coatType: "",
              groomingPreference: "",
              consent: false,
              appointmentDate: null,
              appointmentTime: "",
            });
            onClose();
          }, 2000);
        }
      } catch (error) {
        console.error("Error booking grooming:", error);
        alert("Failed to book grooming appointment. Please try again.");
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
              <h2>Grooming Services Booking</h2>
              <form onSubmit={handleSubmit}>
                {/* Client Information */}
                <motion.div className="form-group" whileHover={{ scale: 1.02 }}>
                  <label>Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} />
                  {errors.name && <span className="error">{errors.name}</span>}
                </motion.div>
                <motion.div className="form-group" whileHover={{ scale: 1.02 }}>
                  <label>Phone Number</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
                  {errors.phone && <span className="error">{errors.phone}</span>}
                </motion.div>
                <motion.div className="form-group" whileHover={{ scale: 1.02 }}>
                  <label>Address</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} />
                  {errors.address && <span className="error">{errors.address}</span>}
                </motion.div>
                <motion.div className="form-group" whileHover={{ scale: 1.02 }}>
                  <label>Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} />
                  {errors.email && <span className="error">{errors.email}</span>}
                </motion.div>

                {/* Animal Information */}
                <motion.div className="form-group" whileHover={{ scale: 1.02 }}>
                  <label>Animal Type</label>
                  <select name="animalType" value={formData.animalType} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                  </select>
                  {errors.animalType && <span className="error">{errors.animalType}</span>}
                </motion.div>
                <motion.div className="form-group" whileHover={{ scale: 1.02 }}>
                  <label>Breed</label>
                  <select name="breed" value={formData.breed} onChange={handleChange}>
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
                  {errors.breed && <span className="error">{errors.breed}</span>}
                </motion.div>
                <motion.div className="form-group" whileHover={{ scale: 1.02 }}>
                  <label>Age of Pet</label>
                  <input type="number" name="age" value={formData.age} onChange={handleChange} />
                  {errors.age && <span className="error">{errors.age}</span>}
                </motion.div>

                {/* Behavioral Notes */}
                <motion.div className="form-group" whileHover={{ scale: 1.02 }}>
                  <label>Behavioral Notes</label>
                  <select name="behavioralNotes" value={formData.behavioralNotes} onChange={handleChange}>
                    <option value="">Select</option>
                    {behavioralNotesOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.behavioralNotes && <span className="error">{errors.behavioralNotes}</span>}
                </motion.div>

                {/* Coat Type */}
                <motion.div className="form-group" whileHover={{ scale: 1.02 }}>
                  <label>Coat Type</label>
                  <select name="coatType" value={formData.coatType} onChange={handleChange}>
                    <option value="">Select</option>
                    {coatTypeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.coatType && <span className="error">{errors.coatType}</span>}
                </motion.div>

                {/* Grooming Preference */}
                <motion.div className="form-group" whileHover={{ scale: 1.02 }}>
                  <label>Grooming Preference</label>
                  <select name="groomingPreference" value={formData.groomingPreference} onChange={handleChange}>
                    <option value="">Select</option>
                    {groomingPreferenceOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.groomingPreference && <span className="error">{errors.groomingPreference}</span>}
                </motion.div>

                {/* Preferred Appointment Date and Time */}
                <motion.div className="form-group" whileHover={{ scale: 1.02 }}>
                  <label>Preferred Appointment Date</label>
                  <DatePicker
                    selected={formData.appointmentDate}
                    onChange={(date) => setFormData({ ...formData, appointmentDate: date })}
                    minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
                    dateFormat="MMMM d, yyyy"
                  />
                  {errors.appointmentDate && <span className="error">{errors.appointmentDate}</span>}
                </motion.div>
                <motion.div className="form-group" whileHover={{ scale: 1.02 }}>
                  <label>Preferred Appointment Time</label>
                  <select name="appointmentTime" value={formData.appointmentTime} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="9 to 12">9 AM to 12 PM</option>
                    <option value="1 to 4">1 PM to 4 PM</option>
                    <option value="4 to 7">4 PM to 7 PM</option>
                  </select>
                  {errors.appointmentTime && <span className="error">{errors.appointmentTime}</span>}
                </motion.div>

                {/* Price Display */}
                <motion.div className="price-display" whileHover={{ scale: 1.02 }}>
                  <h3>Estimated Price: Rs. {price.toFixed(0)}</h3>
                </motion.div>

                {/* Consent Checkbox */}
                <motion.div className="form-group checkbox" whileHover={{ scale: 1.02 }}>
                  <input
                    type="checkbox"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleChange}
                  />
                  <label>Yes, you can groom my pet.</label>
                  {errors.consent && <span className="error">{errors.consent}</span>}
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

          {/* Notification outside modal-content */}
          <AnimatePresence>
            {submitted && (
              <motion.div
                className="notification"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3 }}
              >
                Grooming Appointment Booked Successfully!
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};

export default GroomingForm;