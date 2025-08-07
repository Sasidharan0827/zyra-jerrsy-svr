const express = require("express");
const router = express.Router();
const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} = require("../controllers/wishlist.controller");
const authVerify = require("../middlewares/authverify");
// Add to wishlist via params
router.post("/:userId/:productId", addToWishlist);

// Remove from wishlist via params
router.delete("/:userId/:productId", removeFromWishlist);

// Get all wishlist for a user
router.get("/:userId", getWishlist);

module.exports = router;
