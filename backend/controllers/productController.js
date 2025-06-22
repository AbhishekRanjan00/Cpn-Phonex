const Product = require('../models/Product');

// Create product
const createProduct = async (req, res) => {
  try {
    const { name, price, description, stock } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    const imagePath = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

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
