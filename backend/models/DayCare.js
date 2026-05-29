const mongoose = require('mongoose');

const dayCareSchema = new mongoose.Schema({
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
  petType: {
    type: String,
    required: [true, 'Pet type is required'],
    enum: ['Dog', 'Cat'],
  },
  breed: {
    type: String,
    required: [true, 'Breed is required'],
    trim: true,
  },
  boardingStartDate: {
    type: Date,
    required: [true, 'Boarding start date is required'],
  },
  boardingEndDate: {
    type: Date,
    required: [true, 'Boarding end date is required'],
  },
  noAllergies: {
    type: Boolean,
    required: [true, 'Allergy confirmation is required'],
  },
  socialization: {
    type: String,
    required: [true, 'Socialization preference is required'],
    enum: [
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
    ],
  },
  emergencyContact: {
    type: String,
    required: [true, 'Emergency contact is required'],
    trim: true,
    match: [/^\d{10}$/, 'Emergency contact must be 10 digits'],
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

dayCareSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('DayCare', dayCareSchema);