const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getUserOrders, getAllOrders, updateOrder } = require('../controllers/orderController');

// Get orders for authenticated user
router.get('/me', auth, getUserOrders);

// Get all orders (for admin, no auth for simplicity)
router.get('/', getAllOrders);

// Update an order by ID (for admin)
router.put('/update/:id', updateOrder);

module.exports = router;