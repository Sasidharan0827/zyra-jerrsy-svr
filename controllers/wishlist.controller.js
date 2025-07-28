const Wishlist = require("../models/wishlist.model");

// Add to Wishlist
const addToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const exists = await Wishlist.findOne({ userId, productId });
    if (exists) {
      return res.status(409).json({ message: "Already in wishlist" });
    }

    const newWish = await Wishlist.create({ userId, productId });
    res.status(201).json(newWish);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove from Wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const deleted = await Wishlist.findOneAndDelete({ userId, productId });
    if (!deleted)
      return res.status(404).json({ message: "Item not found in wishlist" });

    res.json({ message: "Removed from wishlist" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Wishlist for User
const getWishlist = async (req, res) => {
  try {
    const { userId } = req.params;

    const wishlist = await Wishlist.find({ userId }).populate("productId");
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports = {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
};
