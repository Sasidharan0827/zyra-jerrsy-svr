const mongoose = require("mongoose");

const bestServiceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Example: "Free Shipping"
    description: { type: String, required: true }, // Example: "On all orders above $50"
    imageUrl: { type: String }, // Optional: For service icon image
    isActive: { type: Boolean, default: true }, // Toggle to show/hide service
  },
  { timestamps: true }
);

module.exports = mongoose.model("BestService", bestServiceSchema);
