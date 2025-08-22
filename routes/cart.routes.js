const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");

// Create cart for user
router.post("/:userId", cartController.createCart);

// Get all carts
router.get("/", cartController.getAllCarts);

// Get cart by userId
router.get("/:userId", cartController.getCartByUser);

// Update cart for user
router.put("/:userId", cartController.updateCart);

// Delete cart by userId
router.delete("/:userId", cartController.deleteCart);

module.exports = router;
