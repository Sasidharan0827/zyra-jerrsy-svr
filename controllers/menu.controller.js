const Menu = require("../models/menu.model");
const cloudinary = require("../cloudinary/cloudinary ");
const fs = require("fs");
// Create a new main menu with optional submenus
const createMenu = async (req, res) => {
  try {
    const { name, subMenus } = req.body;
    const newMenu = new Menu({ name, subMenus });
    await newMenu.save();
    res.status(201).json({ success: true, data: newMenu });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
//catagories
// Get all menus with submenus
const getAllMenus = async (req, res) => {
  try {
    const menus = await Menu.find();
    res.status(200).json({ success: true, data: menus });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get a single menu by ID
const getMenuById = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) return res.status(404).json({ message: "Menu not found" });
    res.status(200).json({ success: true, data: menu });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update a menu or its submenus
const updateMenu = async (req, res) => {
  try {
    const updatedMenu = await Menu.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedMenu)
      return res.status(404).json({ message: "Menu not found" });
    res.status(200).json({ success: true, data: updatedMenu });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete a menu by ID
const deleteMenu = async (req, res) => {
  try {
    const deleted = await Menu.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Menu not found" });
    res.status(200).json({ success: true, message: "Menu deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Add a submenu to a specific main menu
const addSubMenu = async (req, res) => {
  try {
    const { name, description } = req.body;

    const menu = await Menu.findById(req.params.id);
    if (!menu) return res.status(404).json({ message: "Menu not found" });

    let imageUrl = null;

    if (req.file) {
      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "menus/submenus", // optional folder name
      });

      imageUrl = result.secure_url;

      // Delete local file after upload
      fs.unlinkSync(req.file.path);
    }

    // Add submenu
    menu.subMenus.push({ name, description, imageUrl });
    await menu.save();

    res.status(200).json({ success: true, data: menu });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Remove a specific submenu from a main menu
const deleteSubMenu = async (req, res) => {
  try {
    const { submenuId } = req.params;
    const menu = await Menu.findById(req.params.id);
    if (!menu) return res.status(404).json({ message: "Menu not found" });

    menu.subMenus = menu.subMenus.filter(
      (sub) => sub._id.toString() !== submenuId
    );
    await menu.save();
    res.status(200).json({ success: true, data: menu });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all submenus from all menus
const getAllSubMenus = async (req, res) => {
  try {
    const menus = await Menu.find({}, "subMenus"); // Only fetch subMenus field
    const allSubMenus = menus.flatMap((menu) => menu.subMenus);

    res.status(200).json({ success: true, data: allSubMenus });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
// Get all submenus by menu ID
const getSubMenusByMenuId = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);

    if (!menu) {
      return res
        .status(404)
        .json({ success: false, message: "Menu not found" });
    }

    res.status(200).json({ success: true, data: menu.subMenus });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createMenu,
  getAllMenus,
  getMenuById,
  updateMenu,
  deleteMenu,
  addSubMenu,
  deleteSubMenu,
  getAllSubMenus,
  getSubMenusByMenuId,
};
