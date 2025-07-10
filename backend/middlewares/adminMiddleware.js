const User = require('../models/User');

const adminOnly = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ message: 'Not authorized' });

    const user = await User.findById(req.user.id);
    if (!user || !user.isAdmin) return res.status(403).json({ message: 'Admin access required' });

    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = adminOnly;
