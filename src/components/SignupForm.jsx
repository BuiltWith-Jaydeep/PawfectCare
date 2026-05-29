import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const dogBreeds = ["Labrador", "Poodle", "Bulldog", "Beagle", "German Shepherd"];
const catBreeds = ["Siamese", "Persian", "Maine Coon", "Ragdoll", "Bengal"];

const SignupForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    petName: '',
    petType: 'dog',
    breed: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Validation functions
  const validateFullName = (name) => /^[A-Za-z\s]+$/.test(name);
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePhone = (phone) => /^\d{10}$/.test(phone);
  const validatePassword = (password) => {
    const lengthValid = password.length >= 8 && password.length <= 12;
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return lengthValid && hasNumber && hasSymbol;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      if (value === '' || /^[0-9\b]+$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setServerError('');
    let validationErrors = {};

    if (!formData.fullName || !validateFullName(formData.fullName)) {
      validationErrors.fullName = "Please enter a valid full name (letters and spaces only).";
    }
    if (!formData.email || !validateEmail(formData.email)) {
      validationErrors.email = "Please enter a valid email address.";
    }
    if (!formData.phone || !validatePhone(formData.phone)) {
      validationErrors.phone = "Please enter a valid 10-digit phone number.";
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
      validationErrors.password = "Password must be 8-12 characters with a number and symbol.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const signupData = {
      username: formData.fullName, // Map fullName to username
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      address: formData.address,
      petName: formData.petName,
      petType: formData.petType,
      breed: formData.breed,
    };

    console.log('Sending signup data:', signupData); // Debug log

    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', signupData);
      const { token, user } = response.data;

      console.log('Signup response:', response.data); // Debug log

      // Log the user in immediately after signup
      login(token, user);

      // Navigate to home page
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Signup error:', err);
      if (err.response?.data?.errors) {
        const serverErrors = err.response.data.errors.reduce((acc, error) => {
          acc[error.param] = error.msg;
          return acc;
        }, {});
        setErrors(serverErrors);
      } else if (err.response?.data?.message) {
        setServerError(err.response.data.message);
      } else {
        setServerError('Signup failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-form" style={{ position: 'relative', maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <button
        className="back-home-button"
        onClick={() => navigate('/')}
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          padding: '8px 16px',
          fontSize: '1rem',
          border: 'none',
          borderRadius: '5px',
          backgroundColor: '#14B8A6',
          color: '#fff',
          cursor: 'pointer',
          transition: 'background-color 0.3s',
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = '#0d9488')}
        onMouseOut={(e) => (e.target.style.backgroundColor = '#14B8A6')}
      >
        Home
      </button>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Sign Up - PawfectCare</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Full Name:</label>
          <input
            type="text"
            name="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          {errors.fullName && <span className="error" style={{ color: 'red' }}>{errors.fullName}</span>}
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email:</label>
          <input
            type="email"
            name="email"
            placeholder="example@gmail.com"
            value={formData.email}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          {errors.email && <span className="error" style={{ color: 'red' }}>{errors.email}</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Phone:</label>
          <input
            type="text"
            value="+91"
            readOnly
            style={{ width: '50px', padding: '8px', textAlign: 'center', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Enter 10-digit phone"
            value={formData.phone}
            onChange={handleChange}
            style={{ flex: 1, padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>
        {errors.phone && <span className="error" style={{ color: 'red' }}>{errors.phone}</span>}
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Address:</label>
          <textarea
            name="address"
            placeholder="Enter your address"
            value={formData.address}
            onChange={handleChange}
            rows="3"
            style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          {errors.address && <span className="error" style={{ color: 'red' }}>{errors.address}</span>}
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Pet Name:</label>
          <input
            type="text"
            name="petName"
            placeholder="Enter your pet's name"
            value={formData.petName}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          {errors.petName && <span className="error" style={{ color: 'red' }}>{errors.petName}</span>}
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Pet Type:</label>
          <select
            name="petType"
            value={formData.petType}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', color: 'white' }}
          >
            <option value="dog" style={{ color: 'white' }}>Dog</option>
            <option value="cat" style={{ color: 'white' }}>Cat</option>
            <option value="bird" style={{ color: 'white' }}>Bird</option>
            <option value="other" style={{ color: 'white' }}>Other</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Breed:</label>
          <select
            name="breed"
            value={formData.breed}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', color: 'white' }}
          >
            <option value="" style={{ color: 'white' }}>Select Breed</option>
            {(formData.petType === 'dog' ? dogBreeds : formData.petType === 'cat' ? catBreeds : []).map((breed) => (
              <option key={breed} value={breed} style={{ color: 'white' }}>{breed}</option>
            ))}
            {formData.petType === 'bird' && <option value="custom" style={{ color: 'white' }}>Custom Breed</option>}
            {formData.petType === 'other' && <option value="custom" style={{ color: 'white' }}>Custom Breed</option>}
          </select>
          {errors.breed && <span className="error" style={{ color: 'red' }}>{errors.breed}</span>}
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password:</label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type={passwordVisible ? 'text' : 'password'}
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              style={{ flex: 1, padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              style={{
                marginLeft: '10px',
                padding: '8px 12px',
                border: 'none',
                borderRadius: '5px',
                backgroundColor: '#14B8A6',
                color: '#fff',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#0d9488')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#14B8A6')}
            >
              {passwordVisible ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && <span className="error" style={{ color: 'red' }}>{errors.password}</span>}
          <small style={{ color: '#666' }}>
            Password must be 8-12 characters with a number and symbol.
          </small>
        </div>
        {serverError && (
          <span className="error" style={{ color: 'red', textAlign: 'center' }}>{serverError}</span>
        )}
        <button
          type="submit"
          disabled={isLoading}
          style={{
            marginTop: '1rem',
            padding: '10px 20px',
            fontSize: '1rem',
            border: 'none',
            borderRadius: '5px',
            backgroundColor: isLoading ? '#ccc' : '#14B8A6',
            color: '#fff',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s',
          }}
          onMouseOver={(e) => !isLoading && (e.target.style.backgroundColor = '#0d9488')}
          onMouseOut={(e) => !isLoading && (e.target.style.backgroundColor = '#14B8A6')}
        >
          {isLoading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
      <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
        <span>Already have an account? </span>
        <a
          href="/login"
          style={{ color: '#14B8A6', textDecoration: 'none' }}
          onMouseOver={(e) => (e.target.style.textDecoration = 'underline')}
          onMouseOut={(e) => (e.target.style.textDecoration = 'none')}
        >
          Login
        </a>
      </div>
    </div>
  );
};

export default SignupForm;