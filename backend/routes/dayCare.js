const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const dayCareController = require('../controllers/dayCareController');

// User routes (protected)
router.post('/', authMiddleware, dayCareController.createDayCare);
router.get('/user/:userId', authMiddleware, dayCareController.getUserDayCare);

// Admin routes (no auth for now, add admin auth in production)
router.get('/', dayCareController.getAllDayCares); // Fetch all daycare bookings
router.put('/:id', dayCareController.updateDayCare); // Update a daycare booking
router.delete('/:id', dayCareController.deleteDayCare); // Delete a daycare booking

module.exports = router;