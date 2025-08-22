// models/DesignTemplate.js
const mongoose = require("mongoose");

const designTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
  category: { type: String },
  subMenuId: { type: mongoose.Schema.Types.ObjectId, ref: "SubMenu" },
});

module.exports = mongoose.model("DesignTemplate", designTemplateSchema);
