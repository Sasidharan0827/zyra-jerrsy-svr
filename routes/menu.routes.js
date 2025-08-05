const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menu.controller");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
router.get("/submenus", menuController.getAllSubMenus); //catagories
router.post("/", menuController.createMenu);
router.get("/", menuController.getAllMenus);
router.get("/:id", menuController.getMenuById);
router.put("/:id", menuController.updateMenu);
router.delete("/:id", menuController.deleteMenu);
router.get("/:id/submenus", menuController.getSubMenusByMenuId);

// SubMenu routes
router.post("/:id/submenu", upload.single("image"), menuController.addSubMenu);
router.delete("/:id/submenu/:submenuId", menuController.deleteSubMenu);

module.exports = router;
