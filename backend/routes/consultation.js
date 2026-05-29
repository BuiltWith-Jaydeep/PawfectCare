const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const consultationController = require('../controllers/consultationController');

// User routes (protected)
router.post('/', authMiddleware, consultationController.createConsultation);
router.get('/user/:userId', authMiddleware, consultationController.getUserConsultations);

// Admin routes (no auth for now, add admin auth in production)
router.get('/', consultationController.getAllConsultations); // Fetch all consultations
router.put('/:id', consultationController.updateConsultation); // Update a consultation
router.delete('/:id', consultationController.deleteConsultation); // Delete a consultation

module.exports = router;