const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  paymentId: {
    type: String,
    required: true,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  plan: {
    type: String,
    required: true,
  },
  planDetails: {
    veterinary: String,
    grooming: String,
    boarding: String,
    vaccination: String,
    adoption: String,
    bonus: String,
  },
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
