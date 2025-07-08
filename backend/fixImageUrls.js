require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const MONGO_URI = process.env.MONGO_URI;
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

const fixImageUrls = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const products = await Product.find();

    for (let product of products) {
      if (product.image.startsWith('http') && product.image.includes('/undefined/')) {
        const filename = product.image.split('/').pop();
        const fixedUrl = `${BACKEND_URL}/uploads/${filename}`;
        product.image = fixedUrl;
        await product.save();
        console.log(`✅ Fixed URL for: ${product.name}`);
      }
    }

    console.log("✅ All done!");
    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error fixing image URLs:", err);
  }
};

fixImageUrls();
 