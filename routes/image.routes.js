const express = require("express");
const multer = require("multer");
const {
  uploadImage,
  getAllImages,
  updateImage,
  deleteImage,
} = require("../controllers/image.controller");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("image"), uploadImage);
router.get("/", getAllImages);
router.put("/:id", upload.single("image"), updateImage);
router.delete("/:id", deleteImage);

module.exports = router;
