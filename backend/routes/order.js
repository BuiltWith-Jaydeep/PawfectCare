const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { requireAdmin } = require('../middleware/auth');
const { getUserOrders, getAllOrders, updateOrder } = require('../controllers/orderController');

// Get orders for authenticated user
router.get('/me', auth, getUserOrders);

// Get all orders — access: admin only
router.get('/', auth, requireAdmin, getAllOrders);

// Update an order by ID — access: admin only
router.put('/update/:id', auth, requireAdmin, updateOrder);

module.exports = router;