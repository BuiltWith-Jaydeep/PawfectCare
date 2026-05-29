const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// POST /api/auth/login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  console.log('Login attempt with:', { email });

  try {
    const user = await User.findOne({ email });
    console.log('User found:', user ? { id: user._id, email: user.email } : 'No user');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    console.log('Generated token:', token);

    // Include id in userData
    const userData = {
      id: user._id, 
      username: user.username,
      email: user.email,
      phone: user.phone,
      address: user.address,
      petName: user.petName,
      petType: user.petType,
      breed: user.breed,
    };
    console.log('User data prepared:', userData);

    const response = { message: 'Login successful!', token, user: userData };
    console.log('Sending response:', response);
    res.json(response);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

// POST /api/auth/signup
exports.signupUser = async (req, res) => {
  const { username, email, password, phone, address, petName, petType, breed } = req.body;

  console.log('Signup attempt with:', { username, email, phone, address, petName, petType, breed });

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    console.log('Existing user check:', existingUser ? 'User exists' : 'No duplicate');
    if (existingUser) {
      return res.status(400).json({
        message: existingUser.email === email ? 'Email already registered' : 'Username already taken',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully');

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      phone,
      address,
      petName,
      petType,
      breed,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await newUser.save();
    console.log('New user saved:', { id: newUser._id, email: newUser.email, petName: newUser.petName });

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    console.log('Generated token for signup:', token);

    // Include id in userData
    const userData = {
      id: newUser._id, 
      username: newUser.username,
      email: newUser.email,
      phone: newUser.phone,
      address: newUser.address,
      petName: newUser.petName,
      petType: newUser.petType,
      breed: newUser.breed,
    };
    console.log('Signup user data prepared:', userData);

    const response = { message: 'User registered successfully!', token, user: userData };
    console.log('Sending signup response:', response);
    res.status(201).json(response);
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error during signup' });
  }
};