const mongoose = require("mongoose");

const sizeSchema = new mongoose.Schema({
  size: { type: String, required: true },
  // quantity: { type: Number, required: true },
  // stock: { type: Number, required: true },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  heading: { type: String },
  subheading: { type: String },
  rating: { type: Number, default: 0 },
  menuId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Menu",
    required: true,
  },
  subMenuId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubMenu",
  },
  price: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String },
  sizes: [sizeSchema],
  color: { type: String },
  // isOutOfStock: { type: Boolean, default: false },
});

module.exports = mongoose.model("Product", productSchema);
