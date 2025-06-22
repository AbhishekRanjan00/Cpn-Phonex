const Order = require('../models/Order');
const User = require('../models/User');

const getMonthlyStats = async (model, dateField, matchExtra = {}) => {
  return await model.aggregate([
    {
      $match: {
        ...matchExtra,
        [dateField]: {
          $gte: new Date(new Date().getFullYear(), 0, 1),
        },
      },
    },
    {
      $group: {
        _id: { $month: `$${dateField}` },
        total: model.modelName === 'Order' ? { $sum: "$totalAmount" } : { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

exports.getSalesStats = async (req, res) => {
  try {
    const rawData = await getMonthlyStats(Order, 'createdAt', {});
    const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlySales = rawData.map(entry => ({
      month: months[entry._id],
      total: entry.total,
    }));
    const totalSales = rawData.reduce((acc, cur) => acc + cur.total, 0);
    res.json({ monthlySales, totalSales });
  } catch (err) {
    res.status(500).json({ message: 'Sales stats fetch failed', error: err });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const data = await getMonthlyStats(User, 'createdAt', {});
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'User stats fetch failed', error: err });
  }
};

exports.getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    res.json({ totalOrders });
  } catch (err) {
    res.status(500).json({ message: 'Order stats fetch failed', error: err });
  }
};
