const express = require('express');
const router = express.Router();
const { protect , adminOnly} = require('../middlewares/authMiddleware');
const { registerUser, loginUser , getAllUsers ,makeAdmin, verifyEmail,forgotPassword,resetPassword } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const User = require('../models/User');
const {updateUserRole} = require('../controllers/userController');

//public route
router.post('/register', registerUser);
router.post('/login', loginUser);

//admin routes
router.put('/make-admin/:id', protect, adminOnly, makeAdmin); // Add admin-only middleware if needed
router.get("/" ,protect,adminOnly,getAllUsers);

//email verification
router.get("/verify-email/:token" , verifyEmail);
 
//password reset
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
 
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
});


// ✅ PUT route to update user role
router.put('/:id/role', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = req.body.role;
    await user.save();

    res.json({ message: 'User role updated', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});







router.get('/protected', protect, (req, res) => {
  // Since protect sets req.user, you can access user info here
  res.json({
    message: 'Welcome to the protected route!',
    user: req.user,
  });  
}); 
  
module.exports = router;  