// models/DesignTemplate.js
const mongoose = require("mongoose");

const designTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
  category: { type: String },
});

module.exports = mongoose.model("DesignTemplate", designTemplateSchema);
