const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { requireAdmin } = require('../middleware/auth');
const adoptionController = require('../controllers/adoptionController');

// User routes (protected)
router.post('/', authMiddleware, adoptionController.createAdoption);
router.get('/user/:userId', authMiddleware, adoptionController.getUserAdoptions);

// Admin routes — access: admin only (authMiddleware then requireAdmin)
router.get('/', authMiddleware, requireAdmin, adoptionController.getAllAdoptions); // Fetch all adoptions
router.put('/:id', authMiddleware, requireAdmin, adoptionController.updateAdoption); // Update an adoption
router.delete('/:id', authMiddleware, requireAdmin, adoptionController.deleteAdoption); // Delete an adoption

module.exports = router;