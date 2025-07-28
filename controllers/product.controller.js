const Product = require("../models/product.model");
const cloudinary = require("../cloudinary/cloudinary ");
const fs = require("fs");

// Create product (admin only)
const createProduct = async (req, res) => {
  try {
    let sizes = req.body.sizes;

    if (!req.file) {
      return res.status(400).send({ message: "No image file provided." });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);
    fs.unlinkSync(req.file.path); // Delete local file after uploading

    // Parse sizes if it's a string
    if (typeof sizes === "string") {
      sizes = JSON.parse(sizes);
    }

    // Validate sizes array
    if (
      !Array.isArray(sizes) ||
      !sizes.every((item) => item.size && item.quantity != null)
    ) {
      return res.status(400).json({ message: "Invalid sizes format" });
    }

    // Initialize stock equal to quantity
    sizes = sizes.map((item) => ({
      size: item.size,
      quantity: item.quantity,
      stock: item.stock != null ? item.stock : item.quantity, // default stock = quantity
    }));

    // Determine if the product is out of stock
    const isOutOfStock = sizes.every((s) => s.stock === 0);

    // Create new product
    const product = new Product({
      name: req.body.name,
      heading: req.body.heading,
      subheading: req.body.subheading,
      description: req.body.description,
      price: req.body.price,
      rating: req.body.rating,
      category: req.body.category,
      brand: req.body.brand,
      imageUrl: result.secure_url,
      sizes: sizes,
      isOutOfStock: isOutOfStock,
    });

    const savedProduct = await product.save();
    res.status(200).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single product
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update product

const updateProduct = async (req, res) => {
  try {
    // const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update text fields
    product.name = req.body.name;
    product.heading = req.body.heading;
    product.subheading = req.body.subheading;
    product.description = req.body.description;
    product.category = req.body.category;
    product.price = req.body.price;
    product.rating = req.body.rating;

    // Update image if file is uploaded
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      fs.unlinkSync(req.file.path);
      product.imageUrl = result.secure_url;
    }

    // Parse and update sizes if sent (as JSON string in form-data)
    if (req.body.sizes) {
      product.sizes = JSON.parse(req.body.sizes);
    }

    await product.save();
    res.status(200).json(product);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Deleted successfully", deleted });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
