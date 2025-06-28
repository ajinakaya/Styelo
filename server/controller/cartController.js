const Cart = require('../models/cart');

const addToCart = async (req, res) => {
  const { furnitureId, quantity } = req.body;
  const userId = req.user._id;

  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [{ furniture: furnitureId, quantity }] });
    } else {
      const itemIndex = cart.items.findIndex(item => item.furniture.toString() === furnitureId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ furniture: furnitureId, quantity });
      }
    }

    await cart.save();

    const populatedCart = await Cart.findOne({ user: userId }).populate('items.furniture');
    res.status(200).json(populatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.furniture');
    res.status(200).json(cart || { items: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeFromCart = async (req, res) => {
  const { furnitureId } = req.body;

  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.furniture.toString() !== furnitureId);
    await cart.save();

    
    const populatedCart = await Cart.findOne({ user: req.user._id }).populate('items.furniture');
    res.status(200).json(populatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
};
