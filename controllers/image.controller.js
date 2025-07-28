const Image = require("../models/image.model");
const fs = require("fs");
const cloudinary = require("../cloudinary/cloudinary "); // ✅ no .js extension needed

// Upload
const uploadImage = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    const image = await Image.create({
      name: req.body.name,
      imageUrl: result.secure_url,
      cloudinaryId: result.public_id,
    });
    fs.unlinkSync(req.file.path); // remove local file
    res.status(201).json({
      _id: image._id,
      name: image.name,
      imageUrl: image.imageUrl,
      //   cloudinaryId: image.cloudinaryId,
      createdAt: image.createdAt,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Read All
const getAllImages = async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });

    const validImages = images
      .filter((image) => image.name && image.imageUrl && image.createdAt)
      .map((image) => ({
        _id: image._id,
        name: image.name,
        imageUrl: image.imageUrl,
        createdAt: image.createdAt,
      }));

    res.json(validImages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update
const updateImage = async (req, res) => {
  try {
    // 1. Find existing image by ID
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ message: "Image not found" });

    // 2. If new image uploaded, delete old one from Cloudinary and upload new
    if (req.file) {
      // Delete old image from Cloudinary
      if (image.cloudinaryId) {
        await cloudinary.uploader.destroy(image.cloudinaryId);
      }

      // Upload new image
      const result = await cloudinary.uploader.upload(req.file.path);
      image.imageUrl = result.secure_url;
      image.cloudinaryId = result.public_id;

      // Delete local file
      fs.unlinkSync(req.file.path);
    }

    // 3. If name is present in body, update it
    if (req.body.name) {
      image.name = req.body.name;
    }

    // 4. Save updated document
    const updatedImage = await image.save();

    // 5. Return updated document
    res.status(200).json({
      _id: updatedImage._id,
      name: updatedImage.name,
      imageUrl: updatedImage.imageUrl,
      createdAt: updatedImage.createdAt,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete
const deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    await cloudinary.uploader.destroy(image.cloudinaryId);
    await Image.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Export functions (CommonJS style)
module.exports = {
  uploadImage,
  getAllImages,
  updateImage,
  deleteImage,
};
