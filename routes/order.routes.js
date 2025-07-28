const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");

// CREATE
router.post("/create/:userId", orderController.createOrder);

// READ
router.get("/", orderController.getAllOrders);
router.get("/user/:userId", orderController.getOrdersByUser);

// UPDATE
router.put("/:orderId", orderController.updateOrder);

// DELETE
router.delete("/:orderId", orderController.deleteOrder);
//CANCEL
router.patch("/cancel/:userId/:orderId", orderController.cancelOrder);

module.exports = router;
