const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { requireAdmin } = require('../middleware/auth');
const groomingController = require('../controllers/groomingController');

// User routes (protected)
router.post('/', authMiddleware, groomingController.createGrooming);
router.get('/user/:userId', authMiddleware, groomingController.getUserGrooming);

// Admin routes — access: admin only (authMiddleware then requireAdmin)
router.get('/', authMiddleware, requireAdmin, groomingController.getAllGrooming); // Fetch all grooming appointments
router.put('/:id', authMiddleware, requireAdmin, groomingController.updateGrooming); // Update a grooming appointment
router.delete('/:id', authMiddleware, requireAdmin, groomingController.deleteGrooming); // Delete a grooming appointment

module.exports = router;