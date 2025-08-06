const Wishlist = require("../models/wishlist.model");
const Product = require("../models/product.model");
// Add to Wishlist

const addToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

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

    // Filter valid
    const validWishlist = wishlist.filter((item) => item.productId !== null);

    // Auto-remove broken ones
    const invalidItems = wishlist.filter((item) => item.productId === null);
    const invalidIds = invalidItems.map((item) => item._id);
    if (invalidIds.length > 0) {
      await Wishlist.deleteMany({ _id: { $in: invalidIds } });
    }

    if (validWishlist.length === 0) {
      return res.status(404).json({ message: "Wishlist is empty" });
    }

    res.json(validWishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
};
