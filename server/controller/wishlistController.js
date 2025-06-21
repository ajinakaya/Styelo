const Wishlist = require('../models/wishlist');

const addToWishlist = async (req, res) => {
  const { furnitureId } = req.body;
  const userId = req.user._id;

  try {
    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, items: [{ furniture: furnitureId }] });
    } else {
      const exists = wishlist.items.some(item => item.furniture.toString() === furnitureId);
      if (!exists) {
        wishlist.items.push({ furniture: furnitureId });
      }
    }

    await wishlist.save();
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate('items.furniture');
    res.status(200).json(wishlist || { items: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeFromWishlist = async (req, res) => {
  const { furnitureId } = req.body;

  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });

    wishlist.items = wishlist.items.filter(item => item.furniture.toString() !== furnitureId);
    await wishlist.save();

    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
};
