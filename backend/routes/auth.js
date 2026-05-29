const express = require('express');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');

const router = express.Router();

// Rate Limiter Middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(limiter);

// User Signup
router.post(
  '/signup',
  [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').matches(/^\d{10}$/).withMessage('Phone number must be 10 digits'),
    body('address').trim().notEmpty().withMessage('Address is required'),
    body('petName').trim().notEmpty().withMessage('Pet name is required'),
    body('petType')
      .isIn(['dog', 'cat', 'bird', 'other'])
      .withMessage('Pet type must be dog, cat, bird, or other'),
    body('breed').trim().notEmpty().withMessage('Breed is required'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    authController.signupUser(req, res);
  }
);

// User Login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    authController.loginUser(req, res);
  }
);

module.exports = router;