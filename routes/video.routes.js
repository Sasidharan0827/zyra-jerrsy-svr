const express = require("express");
const router = express.Router();
const multer = require("multer");
const videoController = require("../controllers/video.controller");

// Multer config to store video in memory (no local disk storage)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Limit to 50MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only video files are allowed"), false);
    }
  },
});

// Routes
router.post("/upload", upload.single("video"), videoController.uploadVideo);
router.get("/", videoController.getAllVideos);
router.put("/:id", upload.single("video"), videoController.updateVideo);
router.delete("/:id", videoController.deleteVideo);

module.exports = router;
