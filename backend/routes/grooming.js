const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const groomingController = require('../controllers/groomingController');

// User routes (protected)
router.post('/', authMiddleware, groomingController.createGrooming);
router.get('/user/:userId', authMiddleware, groomingController.getUserGrooming);

// Admin routes (no auth for now, add admin auth in production)
router.get('/', groomingController.getAllGrooming); // Fetch all grooming appointments
router.put('/:id', groomingController.updateGrooming); // Update a grooming appointment
router.delete('/:id', groomingController.deleteGrooming); // Delete a grooming appointment

module.exports = router;