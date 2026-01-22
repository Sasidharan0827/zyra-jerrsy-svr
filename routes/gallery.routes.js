const express = require("express");
const router = express.Router();
const galleryController = require("../controllers/gallery.controller");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("image"), galleryController.createGallery);
router.get("/", galleryController.getGalleries);
router.put("/:id", upload.single("image"), galleryController.updateGallery);
router.delete("/:id", galleryController.deleteGallery);
router.get("/type/:type", galleryController.getGalleriesByType);
module.exports = router;
