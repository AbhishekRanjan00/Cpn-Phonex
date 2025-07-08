require('dotenv').config(); // ✅ Make sure this is at the very top
const Product = require('../models/Product');

console.log("🌐 BACKEND_URL from env:", process.env.BACKEND_URL);

const createProduct = async (req, res) => {
  try {
    const { name, price, description, stock } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    // 🔍 Log the BACKEND_URL value for debugging
    console.log("🌍 BACKEND_URL:", process.env.BACKEND_URL);

    // ✅ Use full production backend URL or fallback to localhost
    const backendURL = process.env.BACKEND_URL || 'http://localhost:3000';
    const imagePath = `${backendURL}/uploads/${req.file.filename}`;

    const newProduct = new Product({
      name,
      price,
      description,
      stock,
      image: imagePath,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create product', error: err.message });
  }
};

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products', error: err.message });
  }
};

// Export properly
module.exports = {
  createProduct,
  getProducts
};
