// src/components/Auth/SignupForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const dogBreeds = ["Labrador", "Poodle", "Bulldog", "Beagle", "German Shepherd"];
const catBreeds = ["Siamese", "Persian", "Maine Coon", "Ragdoll", "Bengal"];

const SignupForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    petName: '',
    petType: 'dog', // Default to dog; user can select cat too.
    breed: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  // Validators
  const validateFullName = (name) => /^[A-Za-z\s]+$/.test(name);
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePhone = (phone) => /^\d+$/.test(phone);
  const validatePassword = (password) => {
    const lengthValid = password.length >= 8 && password.length <= 12;
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return lengthValid && hasNumber && hasSymbol;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // For phone number, restrict input to numbers
    if(name === 'phone'){
      if(value === '' || /^[0-9\b]+$/.test(value)){
         setFormData({...formData, [name]: value});
      }
    } else {
      setFormData({...formData, [name]: value});
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let validationErrors = {};

    if (!formData.fullName || !validateFullName(formData.fullName)) {
      validationErrors.fullName = "Please enter a valid full name (letters and spaces only).";
    }
    if (!formData.email || !validateEmail(formData.email)) {
      validationErrors.email = "Please enter a valid email address.";
    }
    if (!formData.phone || !validatePhone(formData.phone)) {
      validationErrors.phone = "Please enter a valid phone number.";
    }
    if (!formData.address) {
      validationErrors.address = "Address is required.";
    }
    if (!formData.petName) {
      validationErrors.petName = "Pet name is required.";
    }
    if (!formData.breed) {
      validationErrors.breed = "Please select a breed.";
    }
    if (!formData.password || !validatePassword(formData.password)) {
      validationErrors.password = "Password must be 8-12 characters long and include at least one number and one symbol.";
    }

    if(Object.keys(validationErrors).length > 0){
      setErrors(validationErrors);
      return;
    }
    
    // Here, add your API call or further submission logic.
    console.log("Form submitted", formData);
    // After successful signup, navigate to the login page:
    navigate('/login');
  };

  return (
    <div className="glass-form">
      <h2>Sign Up - PawfectCare</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Full Name */}
        <div>
          <label>Full Name:</label>
          <input
            type="text"
            name="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleChange}
          />
          {errors.fullName && <span className="error">{errors.fullName}</span>}
        </div>

        {/* Email */}
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            placeholder="example@gmail.com"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        {/* Phone Number */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label>Phone:</label>
          <input
            type="text"
            value="+91"
            readOnly
            style={{ width: '50px', textAlign: 'center' }}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        {errors.phone && <span className="error">{errors.phone}</span>}

        {/* Address */}
        <div>
          <label>Address:</label>
          <textarea
            name="address"
            placeholder="Enter your address"
            value={formData.address}
            onChange={handleChange}
            rows="3"
          ></textarea>
          {errors.address && <span className="error">{errors.address}</span>}
        </div>

        {/* Pet Name */}
        <div>
          <label>Pet Name:</label>
          <input
            type="text"
            name="petName"
            placeholder="Enter your pet's name"
            value={formData.petName}
            onChange={handleChange}
          />
          {errors.petName && <span className="error">{errors.petName}</span>}
        </div>

        {/* Pet Type & Breed */}
        <div>
          <label>Pet Type:</label>
          <select name="petType" value={formData.petType} onChange={handleChange}>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
          </select>
        </div>
        <div>
          <label>Breed:</label>
          <select name="breed" value={formData.breed} onChange={handleChange}>
            <option value="">Select Breed</option>
            {(formData.petType === 'dog' ? dogBreeds : catBreeds).map((breed, index) => (
              <option key={index} value={breed}>{breed}</option>
            ))}
          </select>
          {errors.breed && <span className="error">{errors.breed}</span>}
        </div>

        {/* Password */}
        <div>
          <label>Password:</label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
            />
            <button type="button" onClick={() => setPasswordVisible(!passwordVisible)}>
              {passwordVisible ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && <span className="error">{errors.password}</span>}
          <small>Password must be 8-12 characters and include at least one number and one symbol.</small>
        </div>

        {/* Signup Button */}
        <button type="submit" style={{ marginTop: '1rem' }}>Sign Up</button>
      </form>

      {/* Link to Login */}
      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <span>Already have an account? </span>
        <a href="/login">Login</a>
      </div>
    </div>
  );
};

export default SignupForm;
