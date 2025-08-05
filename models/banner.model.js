const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    type: {
      type: String,
      enum: [
        "main",
        "men",
        "women",
        "kids",
        "offers",
        "new-arrivals",
        "trending",
      ],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Banner", bannerSchema);
