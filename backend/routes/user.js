const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { requireAdmin } = require('../middleware/auth');
const User = require('../models/User');
const userController = require('../controllers/userController');

// GET the logged-in user's data
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Server error fetching user data' });
  }
});

// UPDATE the logged-in user's data
router.put('/me', authMiddleware, async (req, res) => {
  const { username, email, phone, address, petName, petType, breed } = req.body;

  try {
    const updates = {};
    if (username) updates.username = username;
    if (email) updates.email = email;
    if (phone) updates.phone = phone;
    if (address) updates.address = address;
    if (petName) updates.petName = petName;
    if (petType) updates.petType = petType;
    if (breed) updates.breed = breed;
    updates.updatedAt = new Date();

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Error updating user:', error);
    if (error.code === 11000) { // Duplicate key error 
      return res.status(400).json({ error: 'Email or username already in use' });
    }
    res.status(500).json({ error: 'Server error updating user data' });
  }
});

// CRUD routes for admin panel
router.get('/', authMiddleware, requireAdmin, userController.getAllUsers);   // access: admin only
router.post('/', authMiddleware, requireAdmin, userController.createUser);   // access: admin only
router.put('/:id', authMiddleware, requireAdmin, userController.updateUser); // access: admin only
router.delete('/:id', authMiddleware, requireAdmin, userController.deleteUser); // access: admin only

module.exports = router;