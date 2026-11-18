const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { requireAdmin } = require('../middleware/auth');
const consultationController = require('../controllers/consultationController');

// User routes (protected)
router.post('/', authMiddleware, consultationController.createConsultation);
router.get('/user/:userId', authMiddleware, consultationController.getUserConsultations);

// Admin routes — access: admin only (authMiddleware then requireAdmin)
router.get('/', authMiddleware, requireAdmin, consultationController.getAllConsultations); // Fetch all consultations
router.put('/:id', authMiddleware, requireAdmin, consultationController.updateConsultation); // Update a consultation
router.delete('/:id', authMiddleware, requireAdmin, consultationController.deleteConsultation); // Delete a consultation

module.exports = router;