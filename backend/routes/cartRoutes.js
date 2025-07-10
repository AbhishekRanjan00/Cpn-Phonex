const express = require('express');
const router = express.Router();
const { addToCart, getCart, removeFromCart } = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/add', protect, addToCart);
router.get('/', protect, getCart);
router.delete('/:productId', protect, removeFromCart);

module.exports = router;