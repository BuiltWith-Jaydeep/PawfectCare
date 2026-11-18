import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./VaccinationForm.css"; 
import { useNavigate } from "react-router-dom";
import client from '../api/client';
import { useAuth } from "../context/AuthContext"; 

// Breed options
const dogBreeds = ["Labrador", "Poodle", "Bulldog", "Beagle", "German Shepherd"];
const catBreeds = ["Siamese", "Persian", "Maine Coon", "Ragdoll", "Bengal"];

// Vaccine options 
const dogVaccines = [
  "Rabies",
  "Distemper",
  "Parvovirus",
  "Bordetella",
  "Leptospirosis",
  "Canine Influenza",
];
const catVaccines = [
  "Rabies",
  "Feline Calicivirus",
  "Feline Panleukopenia",
  "Bordetella",
];

// Pricing data for vaccines 
const dogVaccinePrices = {
  "Rabies": 350,
  "Distemper": 600,
  "Parvovirus": 400,
  "Bordetella": 450,
  "Leptospirosis": 500,
  "Canine Influenza": 800,
};

const catVaccinePrices = {
  "Rabies": 350,
  "Feline Calicivirus": 700,
  "Feline Panleukopenia": 800,
  "Bordetella": 450,
};

const VaccinationForm = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth(); 
  const token = localStorage.getItem('token');

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    petType: "",
    breed: "",
    age: "",
    vaccine: "",
    appointmentDate: null,
    appointmentTime: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [price, setPrice] = useState(0); 

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Calculate price dynamically
  useEffect(() => {
    const { petType, vaccine } = formData;
    if (petType && vaccine) {
      const vaccinePrices = petType === "Dog" ? dogVaccinePrices : catVaccinePrices;
      const vaccinePrice = vaccinePrices[vaccine] || 0;
      setPrice(vaccinePrice);
    } else {
      setPrice(0);
    }
  }, [formData.petType, formData.vaccine]);

  // Validation logic
  const validate = () => {
    let tempErrors = {};
    if (!formData.name.match(/^[a-zA-Z ]+$/)) tempErrors.name = "Name must contain only letters and spaces.";
    if (!formData.phone.match(/^\d{10}$/)) tempErrors.phone = "Phone number must be exactly 10 digits.";
    if (!formData.address) tempErrors.address = "Address is required.";
    if (!formData.petType) tempErrors.petType = "Please select a pet type.";
    if (!formData.breed) tempErrors.breed = "Please select a breed.";
    if (!formData.age || formData.age <= 0) tempErrors.age = "Please enter a valid age.";
    if (!formData.vaccine) tempErrors.vaccine = "Please select a vaccine.";
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
      alert("You must be logged in to book a vaccination appointment.");
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
        const response = await client.post("/api/vaccinations",
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
              petType: "",
              breed: "",
              age: "",
              vaccine: "",
              appointmentDate: null,
              appointmentTime: "",
            });
            onClose();
          }, 2000);
        }
      } catch (error) {
        console.error("Error booking vaccination:", error);
        alert("Failed to book vaccination appointment. Please try again.");
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
              <h2>Book Vaccination Appointment</h2>
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

                {/* Animal Information */}
                <motion.div className="form-group" whileHover={{ scale: 1.02 }}>
                  <label>Pet Type</label>
                  <select name="petType" value={formData.petType} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                  </select>
                  {errors.petType && <span className="error">{errors.petType}</span>}
                </motion.div>
                <motion.div className="form-group" whileHover={{ scale: 1.02 }}>
                  <label>Breed</label>
                  <select name="breed" value={formData.breed} onChange={handleChange}>
                    <option value="">Select</option>
                    {formData.petType === "Dog" &&
                      dogBreeds.map((breed) => (
                        <option key={breed} value={breed}>
                          {breed}
                        </option>
                      ))}
                    {formData.petType === "Cat" &&
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

                {/* Vaccine Selection */}
                <motion.div className="form-group" whileHover={{ scale: 1.02 }}>
                  <label>Vaccine</label>
                  <select name="vaccine" value={formData.vaccine} onChange={handleChange}>
                    <option value="">Select</option>
                    {formData.petType === "Dog" &&
                      dogVaccines.map((vaccine) => (
                        <option key={vaccine} value={vaccine}>
                          {vaccine}
                        </option>
                      ))}
                    {formData.petType === "Cat" &&
                      catVaccines.map((vaccine) => (
                        <option key={vaccine} value={vaccine}>
                          {vaccine}
                        </option>
                      ))}
                  </select>
                  {errors.vaccine && <span className="error">{errors.vaccine}</span>}
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

          {/* Notification */}
          <AnimatePresence>
            {submitted && (
              <motion.div
                className="notification"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3 }}
              >
                Vaccination Appointment Booked Successfully!
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};

export default VaccinationForm;