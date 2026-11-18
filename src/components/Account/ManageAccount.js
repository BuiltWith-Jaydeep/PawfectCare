import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import client from '../../api/client';

const ManageAccount = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordRules, setPasswordRules] = useState({
    hasUppercase: false,
    hasNumber: false,
    hasSpecialChar: false,
    minLength: false,
  });
  const [passwordMatchError, setPasswordMatchError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await client.get('/api/users/me');
        const data = response.data;
        setFormData({
          fullName: data.username || data.fullName || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } catch (err) {
        setError(err.message || 'Error fetching user data');
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');

    if (name === 'newPassword') {
      setPasswordRules({
        hasUppercase: /[A-Z]/.test(value),
        hasNumber: /\d/.test(value),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
        minLength: value.length >= 8,
      });
    }

    if (name === 'newPassword' || name === 'confirmPassword') {
      const newPass = name === 'newPassword' ? value : formData.newPassword;
      const confirmPass = name === 'confirmPassword' ? value : formData.confirmPassword;
      if (confirmPass && newPass !== confirmPass) {
        setPasswordMatchError("Oops! The passwords don't match. Please check and try again.");
      } else {
        setPasswordMatchError('');
      }
    }
  };

  const isPasswordValid = () =>
    passwordRules.hasUppercase &&
    passwordRules.hasNumber &&
    passwordRules.hasSpecialChar &&
    passwordRules.minLength;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in again.');
      return;
    }

    const updateData = {};
    if (formData.address !== user?.address) updateData.address = formData.address;
    if (formData.currentPassword || formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
        setError('Please fill all password fields to change your password.');
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setError('New password and confirmation do not match.');
        return;
      }
      if (!isPasswordValid()) {
        setError('New password does not meet all requirements.');
        return;
      }
      updateData.currentPassword = formData.currentPassword;
      updateData.newPassword = formData.newPassword;
    }

    try {
      const response = await client.put('/api/users/me', updateData);

      const result = response.data;

      setSuccess('Account updated successfully! Password changed if provided.');
      setFormData((prev) => ({
        ...prev,
        fullName: result.username || result.fullName || prev.fullName,
        address: result.address || prev.address,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      console.error('Update error:', err); // Log for debugging
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3 style={styles.sectionHeader}>Account Details</h3>
      {error && <div style={styles.error}>{error}</div>}
      {success && <div style={styles.success}>{success}</div>}
      <div style={styles.field}>
        <label style={styles.label}>Full Name</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          style={styles.input}
        />
      </div>
      <div style={styles.field}>
        <label style={styles.label}>Email (Cannot be changed)</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          disabled
          style={styles.inputDisabled}
        />
      </div>
      <div style={styles.field}>
        <label style={styles.label}>Phone Number (Cannot be changed)</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          disabled
          style={styles.inputDisabled}
        />
      </div>
      <div style={styles.field}>
        <label style={styles.label}>Address</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          style={styles.textarea}
        />
      </div>

      <h3 style={styles.sectionHeader}>Change Your Password</h3>
      <div style={styles.field}>
        <label style={styles.label}>Current Password</label>
        <input
          type="password"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleChange}
          style={styles.input}
          placeholder="Enter your current password"
        />
      </div>
      <div style={styles.field}>
        <label style={styles.label}>New Password</label>
        <input
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          style={styles.input}
        />
        {formData.newPassword && (
          <div style={styles.passwordRules}>
            <p style={passwordRules.hasUppercase ? styles.ruleMet : styles.rule}>
              Must contain at least one uppercase letter
            </p>
            <p style={passwordRules.hasNumber ? styles.ruleMet : styles.rule}>
              Must contain at least one numerical value
            </p>
            <p style={passwordRules.hasSpecialChar ? styles.ruleMet : styles.rule}>
              Must contain at least one special character
            </p>
            <p style={passwordRules.minLength ? styles.ruleMet : styles.rule}>
              Must be more than 8 characters
            </p>
          </div>
        )}
      </div>
      <div style={styles.field}>
        <label style={styles.label}>Confirm New Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          disabled={!isPasswordValid()}
          style={styles.input}
        />
        {passwordMatchError && (
          <p style={styles.matchError}>{passwordMatchError}</p>
        )}
      </div>

      <button
        type="submit"
        style={{
          ...styles.saveButton,
          ...(formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword
            ? styles.saveButtonDisabled
            : {}),
        }}
        disabled={formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword}
      >
        Save Changes
      </button>
    </form>
  );
};

const styles = {
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  sectionHeader: { fontSize: '20px', fontWeight: 600, color: '#14B8A6', marginBottom: '15px' },
  field: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '14px', fontWeight: 500, color: '#333' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', outline: 'none', transition: 'border-color 0.3s' },
  inputDisabled: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', backgroundColor: '#f5f5f5', color: '#888' },
  textarea: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', minHeight: '100px', resize: 'vertical', outline: 'none' },
  saveButton: { padding: '12px 30px', backgroundColor: '#14B8A6', color: '#fff', border: 'none', borderRadius: '25px', fontSize: '16px', fontWeight: 600, cursor: 'pointer', alignSelf: 'flex-start', transition: 'background-color 0.3s' },
  saveButtonDisabled: { backgroundColor: '#ccc', cursor: 'not-allowed' },
  error: { color: '#e63946', fontSize: '14px', marginBottom: '10px' },
  success: { color: '#34C759', fontSize: '14px', marginBottom: '10px' },
  passwordRules: { marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '5px' },
  rule: { color: '#e63946', fontSize: '12px', margin: 0 },
  ruleMet: { color: '#34C759', fontSize: '12px', margin: 0 },
  matchError: { color: '#e63946', fontSize: '12px', marginTop: '5px' },
};

export default ManageAccount;