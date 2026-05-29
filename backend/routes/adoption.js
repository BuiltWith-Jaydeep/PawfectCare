const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const adoptionController = require('../controllers/adoptionController');

// User routes (protected)
router.post('/', authMiddleware, adoptionController.createAdoption);
router.get('/user/:userId', authMiddleware, adoptionController.getUserAdoptions);

// Admin routes (no auth for now, add admin auth in production)
router.get('/', adoptionController.getAllAdoptions); // Fetch all adoptions
router.put('/:id', adoptionController.updateAdoption); // Update an adoption
router.delete('/:id', adoptionController.deleteAdoption); // Delete an adoption

module.exports = router;