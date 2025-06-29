const CheckoutSession = require('../models/checkoutsession');
const Cart = require('../models/cart');
const ShippingRate = require('../models/shippingrate');

const { v4: uuidv4 } = require('uuid');

// Create checkout session
const createCheckoutSession = async (req, res) => {
  try {
    const { shippingMethod, shippingAddress, paymentMethod } = req.body;
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId }).populate('items.furniture');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const shippingRate = await ShippingRate.findOne({ method: shippingMethod, isActive: true });
    if (!shippingRate) {
      return res.status(400).json({ message: 'Invalid shipping method' });
    }

    const cartItems = cart.items.map(item => ({
      furniture: item.furniture._id,
      quantity: item.quantity,
      price: item.furniture.price
    }));

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = shippingRate.cost;
    const total = subtotal + shippingCost;

    const sessionId = uuidv4();
    const checkoutSession = new CheckoutSession({
      sessionId,
      user: userId,
      cartItems,
      shippingMethod,
      shippingAddress: {
        ...shippingAddress,
        country: shippingAddress.country || 'Nepal'
      },
      paymentMethod,
      subtotal,
      shippingCost,
      total
    });

    await checkoutSession.save();

    res.status(201).json({ success: true, sessionId, session: checkoutSession });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get checkout session
const getCheckoutSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await CheckoutSession.findOne({ sessionId })
      .populate('user')
      .populate('cartItems.furniture');

    if (!session) {
      return res.status(404).json({ message: 'Checkout session not found' });
    }

    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  createCheckoutSession,
  getCheckoutSession,
 
};
