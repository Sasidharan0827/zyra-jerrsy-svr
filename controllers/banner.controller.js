// controllers/banner.controller.js
const Banner = require("../models/banner.model");
const fs = require("fs");
const cloudinary = require("../cloudinary/cloudinary ");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
// 🔹 Create Banner
const createBanner = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "No image provided" });

    const result = await cloudinary.uploader.upload(req.file.path);
    fs.unlinkSync(req.file.path);

    const banner = new Banner({
      title: req.body.title,
      type: req.body.type,
      link: req.body.link,
      image: result.secure_url,
    });

    const saved = await banner.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Get All Banners (or filter by type)
const getBanners = async (req, res) => {
  try {
    const type = req.query.type;
    const banners = type ? await Banner.find({ type }) : await Banner.find();
    res.status(200).json(banners);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Get Single Banner
const getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });
    res.status(200).json(banner);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Update Banner
const updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      fs.unlinkSync(req.file.path);
      banner.imageUrl = result.secure_url;
    }

    banner.title = req.body.title || banner.title;
    banner.type = req.body.type || banner.type;
    banner.link = req.body.link || banner.link;

    const updated = await banner.save();
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Delete Banner
const deleteBanner = async (req, res) => {
  try {
    const deleted = await Banner.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Banner not found" });
    res.status(200).json({ message: "Banner deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get banners by type
const getBannersByType = async (req, res) => {
  try {
    const { type } = req.params;

    const banners = await Banner.find({ type });
    if (banners.length === 0) {
      return res
        .status(404)
        .json({ message: "No banners found for this type" });
    }

    res.json(banners);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Export all functions
module.exports = {
  createBanner,
  getBanners,
  getBannerById,
  updateBanner,
  getBannersByType,
  deleteBanner,
};
