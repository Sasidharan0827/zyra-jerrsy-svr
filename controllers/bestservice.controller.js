const BestService = require("../models/bestservice.model");
const cloudinary = require("../cloudinary/cloudinary ");
const fs = require("fs");
// Create a new Best Service
const createBestService = async (req, res) => {
  try {
    const { title, description, isActive } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required",
      });
    }

    // Multer-Cloudinary gives the image URL directly
    const imageUrl = req.file?.path;

    const newService = new BestService({
      title,
      description,
      isActive: isActive ?? true,
      imageUrl,
    });

    await newService.save();

    res.status(201).json({
      message: "Best service created successfully",
      data: newService,
    });
  } catch (error) {
    console.error("Error creating best service:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all Best Services
const getBestServices = async (req, res) => {
  try {
    const services = await BestService.find({ isActive: true });

    if (!services.length) {
      return res.status(200).json({
        message: "No best services available at the moment",
        data: [],
      });
    }

    res.status(200).json({
      message: "Best services fetched successfully",
      data: services,
    });
  } catch (error) {
    console.error("Error fetching best services:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Best Service by ID
const getBestServiceById = async (req, res) => {
  try {
    const service = await BestService.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Best service not found" });
    }
    res.status(200).json(service);
  } catch (error) {
    console.error("Error fetching best service:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Best Service
const updateBestService = async (req, res) => {
  try {
    // Convert "true"/"false" strings to actual booleans
    if (typeof req.body.isActive === "string") {
      req.body.isActive = req.body.isActive.trim().toLowerCase() === "true";
    }

    const service = await BestService.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ message: "Best service not found" });
    }

    res.status(200).json(service);
  } catch (error) {
    console.error("Error updating best service:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Best Service
const deleteBestService = async (req, res) => {
  try {
    const service = await BestService.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Best service not found" });
    }
    res.status(200).json({ message: "Best service deleted successfully" });
  } catch (error) {
    console.error("Error deleting best service:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createBestService,
  getBestServices,
  getBestServiceById,
  updateBestService,
  deleteBestService,
};
