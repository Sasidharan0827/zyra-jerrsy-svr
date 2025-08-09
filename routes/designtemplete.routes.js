// routes/designTemplateRoutes.js
const express = require("express");

const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const {
  createTemplate,
  getAllTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
} = require("../controllers/designtemplate.controller");

router.post("/", upload.single("image"), createTemplate);
router.get("/", getAllTemplates);
router.get("/:id", getTemplateById);
router.put("/:id", upload.single("image"), updateTemplate);
router.delete("/:id", deleteTemplate);

module.exports = router;
