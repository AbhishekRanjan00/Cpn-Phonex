const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  cancelOrder
} = require('../controllers/orderController');
const adminOnly = require('../middlewares/adminMiddleware');
const { protect } = require('../middlewares/authMiddleware');
const { generateInvoice } = require('../controllers/orderController');




// Checkout (place order from cart)
router.post('/place', protect, placeOrder);

// User's order history
router.get('/my-orders', protect, getUserOrders);

// Admin: All orders
router.get('/all', protect, adminOnly, getAllOrders);

// Admin: Update order status
router.put('/status/:id', protect, adminOnly, updateOrderStatus);

// Delete order (user or admin)
router.delete('/:id', protect, deleteOrder);

// Cancel order (user or admin)
router.delete('/:id/cancel', protect, cancelOrder);

// Generate invoice for an order
router.get('/invoice/:orderId', protect, generateInvoice);

module.exports = router;
