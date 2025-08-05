const express = require("express");
const router = express.Router();
const bannerController = require("../controllers/banner.controller");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("image"), bannerController.createBanner);
router.get("/", bannerController.getBanners);
router.put("/:id", upload.single("image"), bannerController.updateBanner);
router.delete("/:id", bannerController.deleteBanner);

module.exports = router;
