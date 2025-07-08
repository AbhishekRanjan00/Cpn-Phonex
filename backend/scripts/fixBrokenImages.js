require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

const MONGO_URI = process.env.MONGO_URI;
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const brokenProducts = await Product.find({ image: /undefined\/uploads/ });

    for (let p of brokenProducts) {
      const filename = p.image.split('/').pop();
      p.image = `${BACKEND_URL}/uploads/${filename}`;
      await p.save();
      console.log(`🔧 Fixed image for product: ${p.name}`);
    }

    console.log("🎉 All broken images updated.");
    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error fixing images:", err);
  }
})();
