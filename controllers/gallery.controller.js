// controllers/banner.controller.js
const Gallery = require("../models/gallery.model");
const fs = require("fs");
const cloudinary = require("../cloudinary/cloudinary ");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
// 🔹 Create Gallery
const createGallery = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "No image provided" });

    const result = await cloudinary.uploader.upload(req.file.path);
    fs.unlinkSync(req.file.path);

    const gallery = new Gallery({
      title: req.body.title,
      type: req.body.type,

      image: result.secure_url,
    });

    const saved = await gallery.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Get All Galleries (or filter by type)
const getGalleries = async (req, res) => {
  try {
    const type = req.query.type;
    const galleries = type
      ? await Gallery.find({ type })
      : await Gallery.find();
    res.status(200).json(galleries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Get Single Gallery
const getGalleryById = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) return res.status(404).json({ message: "Gallery not found" });
    res.status(200).json(gallery);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Update Gallery
const updateGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) return res.status(404).json({ message: "Gallery not found" });

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      fs.unlinkSync(req.file.path);
      gallery.image = result.secure_url;
    }

    gallery.title = req.body.title || gallery.title;
    gallery.type = req.body.type || gallery.type;

    const updated = await gallery.save();
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Delete Gallery
const deleteGallery = async (req, res) => {
  try {
    const deleted = await Gallery.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Gallery not found" });
    res.status(200).json({ message: "Gallery deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get galleries by type
const getGalleriesByType = async (req, res) => {
  try {
    const { type } = req.params;

    const galleries = await Gallery.find({ type });
    if (galleries.length === 0) {
      return res
        .status(404)
        .json({ message: "No galleries found for this type" });
    }

    res.json(galleries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Export all functions
module.exports = {
  createGallery,
  getGalleries,
  getGalleryById,
  updateGallery,
  getGalleriesByType,
  deleteGallery,
};
