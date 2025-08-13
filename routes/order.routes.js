const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");

// CREATE: Create a new order (COD or Online)
router.post("/create/:userId", orderController.createOrder);

// VERIFY: Verify Razorpay payment and save order
router.post("/payment/verify", orderController.verifyPayment);

// READ: Get all orders for a specific user
router.get("/user/:userId", orderController.getOrdersByUser);

// READ: Get all orders (Admin)
router.get("/", orderController.getAllOrders);

// UPDATE: Update order status
router.put("/:id", orderController.updateOrderStatus);
// DELETE: Delete a specific order for a user
//
module.exports = router;
