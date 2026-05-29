const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^\d{10}$/, 'Phone number must be 10 digits'],
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Invalid email format'],
  },
  animalType: {
    type: String,
    required: [true, 'Animal type is required'],
    enum: ['Dog', 'Cat'],
  },
  breed: {
    type: String,
    required: [true, 'Breed is required'],
    trim: true,
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [0, 'Age must be a positive number'],
  },
  medicalHistory: {
    type: String,
    required: [true, 'Medical history is required'],
    trim: true,
  },
  reason: {
    type: String,
    required: [true, 'Reason for consultation is required'],
    trim: true,
  },
  behavioralNotes: {
    type: String,
    required: [true, 'Behavioral notes are required'],
    trim: true,
  },
  consent: {
    type: Boolean,
    required: [true, 'Consent is required'],
  },
  appointmentDate: {
    type: Date,
    required: [true, 'Appointment date is required'],
  },
  appointmentTime: {
    type: String,
    required: [true, 'Appointment time is required'],
    enum: ['9 to 12', '1 to 4', '4 to 7'],
  },
  estimatedPrice: {
    type: Number,
    required: [true, 'Estimated price is required'],
    min: [0, 'Price must be a positive number'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

consultationSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Consultation', consultationSchema);