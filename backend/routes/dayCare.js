const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { requireAdmin } = require('../middleware/auth');
const dayCareController = require('../controllers/dayCareController');

// User routes (protected)
router.post('/', authMiddleware, dayCareController.createDayCare);
router.get('/user/:userId', authMiddleware, dayCareController.getUserDayCare);

// Admin routes — access: admin only (authMiddleware then requireAdmin)
router.get('/', authMiddleware, requireAdmin, dayCareController.getAllDayCares); // Fetch all daycare bookings
router.put('/:id', authMiddleware, requireAdmin, dayCareController.updateDayCare); // Update a daycare booking
router.delete('/:id', authMiddleware, requireAdmin, dayCareController.deleteDayCare); // Delete a daycare booking

module.exports = router;