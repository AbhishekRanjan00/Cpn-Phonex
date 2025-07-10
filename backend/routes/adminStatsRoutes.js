// backend/routes/adminStatsRoutes.js

const express = require('express');
const router = express.Router();
const {
  getSalesStats,
  getUserStats,
  getOrderStats,
} = require('../controllers/adminStatsController');
const { protect,adminOnly } = require('../middlewares/authMiddleware');

// All routes are protected for admin
router.get('/sales', protect, adminOnly, getSalesStats);
router.get('/users', protect, adminOnly, getUserStats);
router.get('/orders', protect, adminOnly, getOrderStats);

module.exports = router;
