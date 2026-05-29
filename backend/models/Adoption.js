const mongoose = require('mongoose');

const adoptionSchema = new mongoose.Schema({
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
  housingType: {
    type: String,
    required: [true, 'Housing type is required'],
    enum: ['Own House', 'Rent'],
  },
  landlordApproval: {
    type: Boolean,
    default: false, // Only required if housingType is 'Rent'
  },
  petType: {
    type: String,
    required: [true, 'Pet type is required'],
    enum: ['Dog', 'Cat'],
  },
  petExperience: {
    type: String,
    required: [true, 'Pet experience is required'],
    trim: true,
  },
  homeVisitAgreement: {
    type: Boolean,
    required: [true, 'Home visit agreement is required'],
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

adoptionSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Adoption', adoptionSchema);