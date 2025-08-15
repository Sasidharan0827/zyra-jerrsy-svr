const express = require("express");
const router = express.Router();
const bestServiceController = require("../controllers/bestservice.controller");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
// Create Best Service
router.post(
  "/",
  upload.single("image"),
  bestServiceController.createBestService
);

// Get all Best Services
router.get("/", bestServiceController.getBestServices);

// Get Best Service by ID
router.get("/:id", bestServiceController.getBestServiceById);

// Update Best Service
router.put(
  "/:id",
  upload.single("image"),
  bestServiceController.updateBestService
);

// Delete Best Service
router.delete("/:id", bestServiceController.deleteBestService);

module.exports = router;
