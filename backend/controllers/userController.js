const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// REGISTER
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });

    const isFirstUser = (await User.countDocuments()) === 0;
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      isAdmin: isFirstUser,
      verificationToken,
      isVerified: false,
    });

    const verifyURL = `http://localhost:5000/verify-email?token=${verificationToken}`;
    await sendEmail(
      email,
      'Verify Your Email',
      `Click here to verify your email: ${verifyURL}`
    );

    const token = jwt.sign(
      { id: newUser._id, isAdmin: newUser.isAdmin, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        role: newUser.role,
        isVerified: newUser.isVerified,
      },
      token,
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Registration failed' });
  }
};

// LOGIN
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        role: user.role,
        isVerified: user.isVerified,
      },
      token,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed' });
  }
};

// MAKE ADMIN
const makeAdmin = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!req.user?.isAdmin)
      return res.status(403).json({ message: 'Access denied' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isAdmin = true;
    user.role = 'admin';
    await user.save();

    res.status(200).json({ message: 'User promoted to admin' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET ALL USERS
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
   
    res.status(200).json(users);
  } catch (err) {
    console.error('GET USERS ERROR:', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};


// VERIFY EMAIL
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const user = await User.findOne({ verificationToken: token });
    if (!user) return res.status(400).send('Invalid or expired token');

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).send('Email verified successfully');
  } catch (err) {
    res.status(500).send('Email verification failed');
  }
};

// FORGOT PASSWORD
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    await user.save();

    const resetURL = `http://localhost:5000/reset-password?token=${resetToken}`;
    await sendEmail(
      email,
      'Reset Your Password',
      `Reset your password here: ${resetURL}`
    );

    res.status(200).json({ message: 'Password reset link sent' });
  } catch (err) {
    res.status(500).json({ message: 'Password reset failed' });
  }
};

// RESET PASSWORD
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const user = await User.findOne({ resetToken: token });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: 'Reset failed' });
  }
};


const updateUserRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = role;
    await user.save();

    res.json({ message: `Role updated to ${role}` });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { updateUserRole };




module.exports = {
  registerUser,
  loginUser,
  makeAdmin,
  getAllUsers,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
