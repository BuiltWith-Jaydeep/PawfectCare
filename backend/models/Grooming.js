const mongoose = require('mongoose');

const groomingSchema = new mongoose.Schema({
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
  behavioralNotes: {
    type: String,
    required: [true, 'Behavioral notes are required'],
    trim: true,
  },
  coatType: {
    type: String,
    required: [true, 'Coat type is required'],
    enum: [
      "Short and Smooth",
      "Short and Dense",
      "Medium-Length Coat",
      "Long and Silky",
      "Long and Thick",
      "Curly and Wavy",
      "Wiry and Rough",
      "Double Coat (Thick Undercoat)",
      "Hairless or Very Short Coat",
    ],
  },
  groomingPreference: {
    type: String,
    required: [true, 'Grooming preference is required'],
    enum: [
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
    ],
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

groomingSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Grooming', groomingSchema);