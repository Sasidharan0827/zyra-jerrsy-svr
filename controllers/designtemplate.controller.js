// controllers/designTemplateController.js
const DesignTemplate = require("../models/designTemplate ");
const cloudinary = require("../cloudinary/cloudinary ");

const createTemplate = async (req, res) => {
  try {
    const { name, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    // Upload from memory buffer to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "design_templates" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    const template = new DesignTemplate({
      name,
      category,
      imageUrl: uploadResult.secure_url, // Cloudinary URL
    });

    await template.save();
    res.status(201).json({ message: "Design template created", template });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating template", error: error.message });
  }
};

// Get all templates
const getAllTemplates = async (req, res) => {
  try {
    const templates = await DesignTemplate.find();
    res.status(200).json(templates);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching templates", error: error.message });
  }
};

// Get template by ID
const getTemplateById = async (req, res) => {
  try {
    const { id } = req.params;
    const template = await DesignTemplate.findById(id);
    if (!template)
      return res.status(404).json({ message: "Template not found" });
    res.status(200).json(template);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching template", error: error.message });
  }
};

// Update template
const updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, imageUrl, category } = req.body;
    const template = await DesignTemplate.findByIdAndUpdate(
      id,
      { name, imageUrl, category },
      { new: true }
    );
    if (!template)
      return res.status(404).json({ message: "Template not found" });
    res.status(200).json({ message: "Template updated", template });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating template", error: error.message });
  }
};

// Delete template
const deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const template = await DesignTemplate.findByIdAndDelete(id);
    if (!template)
      return res.status(404).json({ message: "Template not found" });
    res.status(200).json({ message: "Template deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting template", error: error.message });
  }
};

module.exports = {
  createTemplate,
  getAllTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
};
