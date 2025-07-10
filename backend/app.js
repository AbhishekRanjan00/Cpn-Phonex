const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');



const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const adminStatsRoutes = require('./routes/adminStatsRoutes');
const contactRoutes = require('./routes/contactRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Load environment variables (except PORT)
dotenv.config(); 

const app = express();
   
// Middleware 
 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:5000',  // your frontend URL
  credentials: true,           // if you need cookies/auth headers
}));  
app.use('/uploads', express.static('uploads'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use("/api/cart" , cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/stats', adminStatsRoutes);
app.use('/api/contact', contactRoutes);
app.use("/api/payment", paymentRoutes);


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI) 
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));
 

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
    