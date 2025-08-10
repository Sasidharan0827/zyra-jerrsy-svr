const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      size: String,
      quantity: Number,
    },
  ],
  designPrint: {
    type: Boolean,
    default: false,
  },
  designId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DesignTemplate",
  },
  totalAmount: Number,
  paymentMethod: {
    type: String,
    enum: ["COD", "Online"],
    default: "COD",
  },
  status: {
    type: String,
    enum: ["Placed", "Shipped", "Delivered", "Cancelled"],
    default: "Placed",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
