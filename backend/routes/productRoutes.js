const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect } = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/adminMiddleware');
const upload = require('../middlewares/upload'); // <-- import multer middleware
const {createProduct} = require('../controllers/productController');
const mongoose = require('mongoose');

// GET all products (public)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching products' });
  }
});

// GET single product by ID (public)
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching product' });
  }
});


// Create a product — Admin only

router.post('/', protect, isAdmin, upload.single('image'), createProduct);
 
 
   

// Update a product — Admin only
router.put('/:id', protect, isAdmin, async (req, res) => {
  const { name, description, price, stock, image } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.stock = stock || product.stock;
    product.image = image || product.image;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while updating product' });
  }
});

module.exports = router;
