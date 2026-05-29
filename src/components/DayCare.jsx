import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { addDays, differenceInDays } from "date-fns";
import "./DayCare.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

// Breed options
const dogBreeds = ["Labrador", "Poodle", "Bulldog", "Beagle", "German Shepherd"];
const catBreeds = ["Siamese", "Persian", "Maine Coon", "Ragdoll", "Bengal"];

// Socialization preferences
const socializationOptions = [
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
const dogPrices = {
  "Labrador": [1200, 2280, 3360, 4320, 5160, 5880, 6480],
  "Poodle": [1100, 2090, 3080, 3960, 4730, 5390, 5940],
  "Bulldog": [1150, 2185, 3220, 4140, 4945, 5635, 6210],
  "Beagle": [1050, 1995, 2940, 3780, 4515, 5145, 5670],
  "German Shepherd": [1300, 2470, 3640, 4680, 5590, 6370, 7020],
};

// Pricing data for cats 
const catPrices = {
  "Siamese": [800, 1520, 2240, 2880, 3440, 3920, 4320],
  "Persian": [850, 1615, 2380, 3060, 3655, 4165, 4590],
  "Maine Coon": [900, 1710, 2520, 3240, 3870, 4410, 4860],
  "Ragdoll": [870, 1653, 2436, 3132, 3741, 4263, 4698],
  "Bengal": [950, 1805, 2660, 3420, 4085, 4655, 5130],
};

const DayCare = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user from AuthContext
  const token = localStorage.getItem('token'); // Get token from localStorage

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    petType: "",
    breed: "",
    boardingDates: [{ startDate: null, endDate: null, key: "selection" }],
    noAllergies: false,
    socialization: "",
    emergencyContact: "",
    appointmentDate: null,
    appointmentTime: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [price, setPrice] = useState(0);
  const today = new Date();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle date range selection
  const handleDateChange = (ranges) => {
    const { selection } = ranges;
    const days = differenceInDays(selection.endDate, selection.startDate) + 1;
    if (days > 7) {
      setErrors({ ...errors, boardingDates: "Maximum 7 days allowed." });
      return;
    }
    setFormData({ ...formData, boardingDates: [selection] });
    setErrors({ ...errors, boardingDates: "" });
  };

  // Calculate price dynamically
  useEffect(() => {
    const { petType, breed, boardingDates } = formData;
    if (petType && breed && boardingDates[0].startDate && boardingDates[0].endDate) {
      const days = differenceInDays(boardingDates[0].endDate, boardingDates[0].startDate) + 1;
      const prices = petType === "Dog" ? dogPrices : catPrices;
      const priceList = prices[breed] || [];
      setPrice(days > 0 && days <= 7 ? priceList[days - 1] || 0 : 0);
    } else {
      setPrice(0);
    }
  }, [formData.petType, formData.breed, formData.boardingDates]);

  // Validation logic
  const validate = () => {
    let tempErrors = {};
    if (!formData.name.match(/^[a-zA-Z ]+$/)) tempErrors.name = "Name must contain only letters and spaces.";
    if (!formData.phone.match(/^\d{10}$/)) tempErrors.phone = "Phone number must be exactly 10 digits.";
    if (!formData.address) tempErrors.address = "Address is required.";
    if (!formData.petType) tempErrors.petType = "Please select a pet type.";
    if (!formData.breed) tempErrors.breed = "Please select a breed.";
    if (!formData.boardingDates[0].startDate || !formData.boardingDates[0].endDate)
      tempErrors.boardingDates = "Please select boarding dates.";
    if (!formData.noAllergies) tempErrors.noAllergies = "You must confirm no allergies.";
    if (!formData.socialization) tempErrors.socialization = "Please select a socialization preference.";
    if (!formData.emergencyContact.match(/^\d{10}$/))
      tempErrors.emergencyContact = "Emergency contact must be a 10-digit number.";
    if (!formData.appointmentDate) tempErrors.appointmentDate = "Please select a preferred date.";
    if (!formData.appointmentTime) tempErrors.appointmentTime = "Please select a preferred time slot.";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Handle form submission with backend integration
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user is logged in
    if (!user || !token) {
      alert("You must be logged in to book daycare.");
      navigate("/login");
      return;
    }

    if (validate()) {
      try {
        // Prepare data for backend
        const dataToSend = {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          petType: formData.petType,
          breed: formData.breed,
          boardingStartDate: formData.boardingDates[0].startDate.toISOString().split("T")[0], // YYYY-MM-DD
          boardingEndDate: formData.boardingDates[0].endDate.toISOString().split("T")[0], // YYYY-MM-DD
          noAllergies: formData.noAllergies,
          socialization: formData.socialization,
          emergencyContact: formData.emergencyContact,
          appointmentDate: formData.appointmentDate.toISOString().split("T")[0], // YYYY-MM-DD
          appointmentTime: formData.appointmentTime,
          estimatedPrice: price,
        };

        // Send POST request to backend
        const response = await axios.post(
          "http://localhost:5000/api/daycare",
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
              boardingDates: [{ startDate: null, endDate: null, key: "selection" }],
              noAllergies: false,
              socialization: "",
              emergencyContact: "",
              appointmentDate: null,
              appointmentTime: "",
            });
            onClose();
          }, 2000);
        }
      } catch (error) {
        console.error("Error booking daycare:", error);
        alert("Failed to book daycare. Please try again.");
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
              <h2>Book Pet Boarding & Daycare</h2>
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

                {/* Pet Information */}
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

                {/* Boarding Dates */}
                <motion.div className="form-group" whileHover={{ scale: 1.02 }}>
                  <label>Boarding Dates</label>
                  <DateRange
                    editableDateInputs={true}
                    onChange={handleDateChange}
                    moveRangeOnFirstSelection={false}
                    ranges={formData.boardingDates}
                    minDate={addDays(today, 1)}
                  />
                  {errors.boardingDates && <span className="error">{errors.boardingDates}</span>}
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

                {/* Socialization Preferences */}
                <motion.div className="form-group" whileHover={{ scale: 1.02 }}>
                  <label>Socialization Preferences</label>
                  <select name="socialization" value={formData.socialization} onChange={handleChange}>
                    <option value="">Select</option>
                    {socializationOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.socialization && <span className="error">{errors.socialization}</span>}
                </motion.div>

                {/* Emergency Vet Contact */}
                <motion.div className="form-group" whileHover={{ scale: 1.02 }}>
                  <label>Emergency Contact No</label>
                  <input type="text" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} />
                  {errors.emergencyContact && <span className="error">{errors.emergencyContact}</span>}
                </motion.div>

                {/* No Allergies Checkbox */}
                <motion.div className="form-group checkbox" whileHover={{ scale: 1.02 }}>
                  <input type="checkbox" name="noAllergies" checked={formData.noAllergies} onChange={handleChange} />
                  <label>Pet has no allergic diseases</label>
                  {errors.noAllergies && <span className="error">{errors.noAllergies}</span>}
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
                Boarding Booked Successfully!
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};

export default DayCare;