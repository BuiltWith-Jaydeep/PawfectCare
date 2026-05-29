import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./BookingF.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const AdoptionForm = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const token = localStorage.getItem('token');

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    housingType: "",
    landlordApproval: false,
    petType: "",
    petExperience: "",
    homeVisitAgreement: false,
    appointmentDate: null,
    appointmentTime: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.name.match(/^[a-zA-Z ]+$/)) tempErrors.name = "Name must contain only letters and spaces.";
    if (!formData.phone.match(/^\d{10}$/)) tempErrors.phone = "Phone number must be exactly 10 digits.";
    if (!formData.address) tempErrors.address = "Address is required.";
    if (!formData.housingType) tempErrors.housingType = "Please select your housing type.";
    if (formData.housingType === "Rent" && !formData.landlordApproval)
      tempErrors.landlordApproval = "Landlord approval is required for renters.";
    if (!formData.petType) tempErrors.petType = "Please select a pet type.";
    if (!formData.petExperience) tempErrors.petExperience = "Please describe your pet experience.";
    if (!formData.homeVisitAgreement) tempErrors.homeVisitAgreement = "You must agree to a home visit.";
    if (!formData.appointmentDate) tempErrors.appointmentDate = "Please select a preferred date.";
    if (!formData.appointmentTime) tempErrors.appointmentTime = "Please select a preferred time slot.";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !token) {
      alert("You must be logged in to submit an adoption request.");
      navigate("/login");
      return;
    }

    if (validate()) {
      try {
        const dataToSend = {
          ...formData,
          appointmentDate: formData.appointmentDate.toISOString().split("T")[0],
        };

        const response = await axios.post(
          "http://localhost:5000/api/adoption",
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
              housingType: "",
              landlordApproval: false,
              petType: "",
              petExperience: "",
              homeVisitAgreement: false,
              appointmentDate: null,
              appointmentTime: "",
            });
            onClose();
          }, 2000);
        }
      } catch (error) {
        console.error("Error submitting adoption request:", error);
        alert("Failed to submit adoption request. Please try again.");
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
              <h2>Pet Adoption Assistance</h2>
              <form onSubmit={handleSubmit}>
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
                  <label>Housing Type</label>
                  <select name="housingType" value={formData.housingType} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="Own House">Own House</option>
                    <option value="Rent">Rent</option>
                  </select>
                  {errors.housingType && <span className="error">{errors.housingType}</span>}
                </motion.div>

                {formData.housingType === "Rent" && (
                  <motion.div className="form-group checkbox" whileHover={{ scale: 1.02 }}>
                    <input
                      type="checkbox"
                      name="landlordApproval"
                      checked={formData.landlordApproval}
                      onChange={handleChange}
                    />
                    <label>Landlord’s Approval for Pet</label>
                    {errors.landlordApproval && <span className="error">{errors.landlordApproval}</span>}
                  </motion.div>
                )}

                <motion.div className="form-group" whileHover={{ scale: 1.02 }}>
                  <label>Which Pet Would You Like?</label>
                  <select name="petType" value={formData.petType} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                  </select>
                  {errors.petType && <span className="error">{errors.petType}</span>}
                </motion.div>

                <motion.div className="form-group" whileHover={{ scale: 1.02 }}>
                  <label>Pet Experience (in years)</label>
                  <input
                    type="text"
                    name="petExperience"
                    value={formData.petExperience}
                    onChange={handleChange}
                  />
                  {errors.petExperience && <span className="error">{errors.petExperience}</span>}
                </motion.div>

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

                <motion.div className="form-group checkbox" whileHover={{ scale: 1.02 }}>
                  <input
                    type="checkbox"
                    name="homeVisitAgreement"
                    checked={formData.homeVisitAgreement}
                    onChange={handleChange}
                  />
                  <label>I agree to a home visit to ensure it’s safe for the pet.</label>
                  {errors.homeVisitAgreement && <span className="error">{errors.homeVisitAgreement}</span>}
                </motion.div>

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

          <AnimatePresence>
            {submitted && (
              <motion.div
                className="notification"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3 }}
              >
                Adoption Request Submitted Successfully!
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};

export default AdoptionForm;