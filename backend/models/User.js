const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: [true, 'Username is required'], 
    unique: true,
    trim: true,
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
  },
  phone: { 
    type: String, 
    required: [true, 'Phone number is required'], // Making required for consistency
    trim: true,
    match: [/^\d{10}$/, 'Phone number must be 10 digits'], 
  },
  address: { 
    type: String, 
    required: [true, 'Address is required'], // Making required for consistency
    trim: true,
  },
  petName: { 
    type: String, 
    required: [true, 'Pet name is required'], 
    trim: true,
  },
  petType: { 
    type: String, 
    required: [true, 'Pet type is required'], 
    enum: ['dog', 'cat', 'bird', 'other'], // Restrict to common types
    lowercase: true,
  },
  breed: { 
    type: String, 
    required: [true, 'Breed is required'], 
    trim: true,
  },
  // Authorization role. Default 'user'; never settable from a signup request body.
  // Promote to 'admin' only via `npm run seed:admin` or directly in the database.
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
    required: true,
    index: true,
  },
}, { 
  timestamps: true // Adds createdAt and updatedAt automatically
});

//  preventing overwrite
module.exports = mongoose.models.User || mongoose.model('User', userSchema);