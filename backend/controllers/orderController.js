const Order = require('../models/Order');
const User = require('../models/User');
const PDFDocument = require('pdfkit');
const sendEmail = require('../utils/sendEmail'); // ✅ Using centralized email utility

// ✅ Place order from cart (checkout)
const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { products, totalAmount, shippingDetails } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: 'No products to order' });
    }

    if (!shippingDetails || !shippingDetails.name || !shippingDetails.phone || !shippingDetails.address) {
      return res.status(400).json({ message: 'Shipping details are required' });
    }

    const newOrder = new Order({
      user: userId,
      products,
      totalAmount,
      shippingDetails,
    });

    await newOrder.save();

    // ✅ Send order confirmation email
    await sendEmail(
      req.user.email,
      'Order Confirmation - Cpn Phonex',
      `Thank you for your order!\n\nOrder ID: ${newOrder._id}\nTotal: ₹${totalAmount}\n\nWe will ship your items soon.`
    );

    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while placing order' });
  }
};

// ✅ Get user's orders
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('products.product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// ✅ Get all orders (admin only)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('products.product', 'name price');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch all orders' });
  }
};

// ✅ Update order status
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const allowedStatuses = ['Pending', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    const updatedOrder = await order.save();

    res.json({ message: `Order status updated to ${status}`, order: updatedOrder });
  } catch (err) {
    res.status(500).json({ message: 'Error updating order status' });
  }
};

// ✅ Cancel order
const cancelOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  if (order.status !== 'Pending') {
    return res.status(400).json({ message: 'Cannot cancel after shipped' });
  }

  await order.remove();
  res.json({ message: 'Order cancelled' });
};

// ✅ Generate invoice for an order
const generateInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate('products.product');

    if (!order) return res.status(404).send('Order not found');

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice_${order._id}.pdf`);
    doc.pipe(res);

    doc.fontSize(20).text('Invoice', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Order ID: ${order._id}`);
    doc.text(`Date: ${order.createdAt.toDateString()}`);
    doc.text(`Name: ${order.shippingDetails?.name}`);
    doc.text(`Phone: ${order.shippingDetails?.phone}`);
    doc.text(`Address: ${order.shippingDetails?.address}`);
    doc.moveDown();

    doc.text('Items:', { underline: true });
    order.products.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.product.name} - ₹${item.product.price} x ${item.quantity}`);
    });

    doc.moveDown();
    doc.text(`Total Amount: ₹${order.totalAmount}`, { bold: true });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).send('Could not generate invoice');
  }
};

// ✅ Delete order (user or admin)
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this order' });
    }

    await order.deleteOne();
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while deleting order' });
  }
};

module.exports = {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  cancelOrder,
  generateInvoice,
};
