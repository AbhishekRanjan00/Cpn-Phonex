const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');

const { protect, adminOnly } = require('../middlewares/authMiddleware');
const { toggleAdmin } = require('../controllers/adminController');
const { getAllUsers, makeAdmin, updateUserRole } = require('../controllers/userController');

// ✅ Get all users
router.get('/users', protect, adminOnly, getAllUsers);

// ✅ Promote user to admin
router.put('/make-admin/:id', protect, adminOnly, (req, res) => {
  req.body.action = 'promote';
  toggleAdmin(req, res);
});

// ✅ Toggle role manually
router.put('/toggle-role/:id', protect, adminOnly, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const newRole = req.body.role;
  user.role = newRole;
  user.isAdmin = newRole === 'admin';
  await user.save();

  res.json({ message: `User role changed to ${newRole}`, newRole });
});

// ✅ Order stats
router.get('/orders', protect, adminOnly, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    res.json({ totalOrders });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Sales analytics
router.get('/sales', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find({ isPaid: true });

    const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const monthlySalesMap = {};

    orders.forEach(order => {
      const month = new Date(order.createdAt).toLocaleString('default', { month: 'short' });
      monthlySalesMap[month] = (monthlySalesMap[month] || 0) + order.totalAmount;
    });

    const monthlySales = Object.entries(monthlySalesMap).map(([month, total]) => ({
      month,
      total,
    }));

    res.json({ totalSales, monthlySales });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Delete user
router.delete('/users/:id', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user' });
  }
});

module.exports = router;
