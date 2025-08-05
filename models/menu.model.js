const mongoose = require("mongoose");

const SubMenuSchema = new mongoose.Schema({
  name: String,
  description: String,
  imageUrl: String,
});

const MenuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  subMenus: [SubMenuSchema],
});

module.exports = mongoose.model("Menu", MenuSchema);
module.exports = mongoose.model("SubMenu", SubMenuSchema);
