const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const vaccinationController = require('../controllers/vaccinationController');

// User routes (protected)
router.post('/', authMiddleware, vaccinationController.createVaccination);
router.get('/user/:userId', authMiddleware, vaccinationController.getUserVaccinations);

// Admin routes (no auth for now, add admin auth in production)
router.get('/', vaccinationController.getAllVaccinations); // Fetch all vaccinations
router.put('/:id', vaccinationController.updateVaccination); // Update a vaccination
router.delete('/:id', vaccinationController.deleteVaccination); // Delete a vaccination

module.exports = router;