const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: {
    type: String,
    required: true,
  },
  addressLine: String,
  city: String,
  state: String,
  postalCode: String,
  country: String,
  phone: {
    type: String,
    required: true,
  },
  secondary_phone: String,
});

module.exports = mongoose.model("Address", addressSchema);
