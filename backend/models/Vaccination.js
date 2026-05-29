const mongoose = require('mongoose');

const vaccinationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  petType: { type: String, required: true },
  breed: { type: String, required: true },
  age: { type: Number, required: true },
  vaccine: { type: String, required: true },
  appointmentDate: { type: String, required: true },
  appointmentTime: { type: String, required: true },
  estimatedPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Vaccination', vaccinationSchema);