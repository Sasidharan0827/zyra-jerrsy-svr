const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    type: {
      type: String,
      enum: ["men", "women", "kids"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gallery", gallerySchema);
