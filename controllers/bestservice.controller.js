const BestService = require("../models/bestservice.model");
const cloudinary = require("../cloudinary/cloudinary ");
const fs = require("fs");

// Create Best Service
const createBestService = async (req, res) => {
  try {
    const { title, description, isActive } = req.body;

    // Validation
    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required",
      });
    }

    let imageUrl = null;

    // If file is uploaded, push it to Cloudinary directly from buffer
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "best-services" }, // optional Cloudinary folder
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer); // send buffer instead of file path
      });

      imageUrl = result.secure_url;
    }

    // Create new service document
    const newService = new BestService({
      title,
      description,
      isActive: isActive !== undefined ? isActive : true, // default true
      imageUrl,
    });

    await newService.save();

    res.status(201).json({
      message: "Best service created successfully",
      data: newService,
    });
  } catch (error) {
    console.error("Error creating best service:", error);
    res.status(500).json({ message: "Server error", error: error.message });
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
