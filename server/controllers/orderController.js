import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import { calculateOrderTotals } from '../utils/helpers.js';

const generateTransactionId = () => {
  const segment = () => Math.random().toString(36).substring(2, 8).toUpperCase();
  return `SHUB-${segment()}-${segment()}`;
};

const buildOrderFromCart = async (userId) => {
  const cart = await Cart.findOne({ userId }).populate('items.productId');
  if (!cart || cart.items.length === 0) {
    throw new Error('Cart is empty');
  }

  const orderItems = cart.items.map((item) => ({
    productId: item.productId._id,
    title: item.productId.title,
    price: item.productId.price,
    quantity: item.quantity,
    image: item.productId.images[0],
  }));

  const totals = calculateOrderTotals(orderItems);
  return { cart, orderItems, totals };
};

export const placeMockOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod = 'card' } = req.body;

    if (!shippingAddress?.fullName || !shippingAddress?.street || !shippingAddress?.city) {
      return res.status(400).json({ message: 'Complete shipping address is required' });
    }

    const { cart, orderItems, totals } = await buildOrderFromCart(req.user._id);

    await new Promise((resolve) => setTimeout(resolve, 1200));

    const order = await Order.create({
      userId: req.user._id,
      items: orderItems,
      shippingAddress,
      subtotal: totals.subtotal,
      tax: totals.tax,
      shipping: totals.shipping,
      total: totals.total,
      paymentMethod,
      transactionId: generateTransactionId(),
      status: 'paid',
    });

    cart.items = [];
    await cart.save();

    const populated = await Order.findById(order._id).populate('items.productId');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCheckoutPreview = async (req, res) => {
  try {
    const { orderItems, totals } = await buildOrderFromCart(req.user._id);
    res.json({ items: orderItems, totals });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.productId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate('items.productId');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
