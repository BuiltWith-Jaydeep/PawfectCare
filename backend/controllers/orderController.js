const Order = require('../models/Order');

// Get orders for authenticated user
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ userId });
    res.json(orders || []);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all orders for admin
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders || []);
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update an order
exports.updateOrder = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order updated successfully', order: updatedOrder });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};