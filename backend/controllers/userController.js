const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');

// GET all users without pass
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// LOGIN user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // user hai
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token, user: { id: user._id, email: user.email, username: user.username, role: user.role || 'user' } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET user ka data succ login ke badd (requires auth middleware to set req.user)
exports.getLoggedInUser = async (req, res) => {
  try {
    // auth middd atach the user ID to req.user
    const userId = req.user.id;

    // data fetch
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// UPDATE the logged-in user's data 
exports.updateLoggedInUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, email, phone, address, petName, petType, breed, currentPassword, newPassword } = req.body;

    // Fetch the current user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Build update object with only provided fields
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (petName) updateData.petName = petName;
    if (petType) updateData.petType = petType;
    if (breed) updateData.breed = breed;

    // Handle password update only if all password fields are provided
    if (currentPassword || newPassword) {
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Please provide both current and new password to update password' });
      }

      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid current password' });
      }

      // Hash and set new password
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    // Update user data
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true })
      .select('-password');
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User updated successfully!', user: updatedUser });
  } catch (error) {
    console.error('Update error:', error); // Add logging for debugging
    res.status(500).json({ error: 'Server error' });
  }
};

// GET a user by ID (excluding password)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// CREATE a new user
exports.createUser = async (req, res) => {
  try {
    const { username, email, password, phone, address, petName, petType, breed } = req.body;
    
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      phone,
      address,
      petName,
      petType,
      breed
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully!', user: newUser });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// UPDATE user completely (PUT)
exports.updateUser = async (req, res) => {
  try {
    const { username, email, password, phone, address, petName, petType, breed } = req.body;
    const updateData = { username, email, phone, address, petName, petType, breed };

    // Hash password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
                                  .select('-password');
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User updated successfully!', user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// PARTIAL update user (PATCH)
exports.patchUser = async (req, res) => {
  try {
    const updateData = { ...req.body };
    // Never allow privilege escalation or id tampering through a request body.
    delete updateData.role;
    delete updateData._id;
    delete updateData.__v;
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
                                  .select('-password');
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User partially updated successfully!', user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE a user
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};