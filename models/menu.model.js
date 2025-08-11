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
  subMenus: {
    type: [SubMenuSchema],
    default: [], // <-- ensures subMenus is never undefined
  },
});

const Menu = mongoose.model("Menu", MenuSchema);
const SubMenu = mongoose.model("SubMenu", SubMenuSchema);

// Export both in an object
module.exports = { Menu, SubMenu };
