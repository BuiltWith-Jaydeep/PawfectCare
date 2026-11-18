const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { requireAdmin } = require('../middleware/auth');
const vaccinationController = require('../controllers/vaccinationController');

// User routes (protected)
router.post('/', authMiddleware, vaccinationController.createVaccination);
router.get('/user/:userId', authMiddleware, vaccinationController.getUserVaccinations);

// Admin routes — access: admin only (authMiddleware then requireAdmin)
router.get('/', authMiddleware, requireAdmin, vaccinationController.getAllVaccinations); // Fetch all vaccinations
router.put('/:id', authMiddleware, requireAdmin, vaccinationController.updateVaccination); // Update a vaccination
router.delete('/:id', authMiddleware, requireAdmin, vaccinationController.deleteVaccination); // Delete a vaccination

module.exports = router;