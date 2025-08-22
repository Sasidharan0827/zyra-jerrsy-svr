// routes/designTemplateRoutes.js
const express = require("express");
const multer = require("multer");
const router = express.Router();
// Store file in memory so we can stream it directly to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

const {
  createTemplate,
  getAllTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
  getTemplatesBySubMenuId,
} = require("../controllers/designtemplate.controller");
router.get("/:subMenuId", getTemplatesBySubMenuId);
router.post("/", upload.single("image"), createTemplate);
router.get("/", getAllTemplates);
router.get("/:id", getTemplateById);
router.put("/:id", upload.single("image"), updateTemplate);
router.delete("/:id", deleteTemplate);

module.exports = router;
