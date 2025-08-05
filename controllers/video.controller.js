const Video = require("../models/video.model");
const cloudinary = require("../cloudinary/cloudinary ");

// Upload video directly from memory
const uploadVideo = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    if (!req.file.mimetype.startsWith("video/")) {
      return res.status(400).json({ message: "Only video files are allowed" });
    }

    // Convert buffer to base64 for Cloudinary
    const base64Str = req.file.buffer.toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${base64Str}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      resource_type: "video",
      folder: "zyra_videos",
    });

    const video = await Video.create({
      name: req.body.name,
      videoUrl: result.secure_url,
      cloudinaryId: result.public_id,
    });

    res.status(201).json({
      _id: video._id,
      name: video.name,
      videoUrl: video.videoUrl,
      createdAt: video.createdAt,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all videos
const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update video
const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    // Delete old video
    await cloudinary.uploader.destroy(video.cloudinaryId, {
      resource_type: "video",
    });

    const base64Str = req.file.buffer.toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${base64Str}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      resource_type: "video",
      folder: "zyra_videos",
    });

    video.name = req.body.name || video.name;
    video.videoUrl = result.secure_url;
    video.cloudinaryId = result.public_id;
    await video.save();

    res.json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete video
const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    await cloudinary.uploader.destroy(video.cloudinaryId, {
      resource_type: "video",
    });

    await video.deleteOne();
    res.json({ message: "Video deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  uploadVideo,
  getAllVideos,
  updateVideo,
  deleteVideo,
};
