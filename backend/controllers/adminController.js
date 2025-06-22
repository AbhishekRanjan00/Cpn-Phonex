const User = require('../models/User');


// Promote or demote a user
const toggleAdmin = async (req, res) => {
  try {
    const userId = req.params.id;
    const action = req.body.action; // 'promote' or 'demote'

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (action === 'promote') {
      user.isAdmin = true;
      user.role = 'admin';
    } else if (action === 'demote') {
      user.isAdmin = false;
      user.role = 'user';
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    await user.save();
    res.status(200).json({ message: `User ${action}d successfully` });

  } catch (err) {
    console.error('Error toggling admin status:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { toggleAdmin };


