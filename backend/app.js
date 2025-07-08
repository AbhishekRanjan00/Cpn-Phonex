const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();

// ✅ 1. CORS middleware (for APIs)
app.use(cors({
  origin: ['http://localhost:5000', 'https://cpnphonex.netlify.app'],
  credentials: true,
}));

// ✅ 2. JSON and URL parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ 3. Static image serving with proper CORS headers
app.use('/uploads', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ 4. Routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/admin/stats', require('./routes/adminStatsRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));

// ✅ 5. Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ✅ 6. Start server
app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});
