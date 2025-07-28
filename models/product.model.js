const mongoose = require("mongoose");

const sizeSchema = new mongoose.Schema({
  size: { type: String, required: true },
  quantity: { type: Number, required: true },
  stock: { type: Number, required: true },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  heading: { type: String },
  subheading: { type: String },
  rating: { type: Number, default: 0 },
  category: { type: String, required: true },
  price: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String },
  sizes: [sizeSchema],
  isOutOfStock: { type: Boolean, default: false },
});

module.exports = mongoose.model("Product", productSchema);
