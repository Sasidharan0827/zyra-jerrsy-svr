const Product = require("../models/product.model");
const cloudinary = require("../cloudinary/cloudinary ");
const fs = require("fs");
const Menu = require("../models/menu.model");

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
    if (!Array.isArray(sizes) || !sizes.every((item) => item.size != null)) {
      return res.status(400).json({ message: "Invalid sizes format" });
    }

    // Cleaned size structure (no stock)
    sizes = sizes.map((item) => ({
      size: item.size,
      // quantity: item.quantity,
    }));

    // Create new product
    const product = new Product({
      name: req.body.name,
      heading: req.body.heading,
      subheading: req.body.subheading,
      description: req.body.description,
      price: req.body.price,
      rating: req.body.rating,
      subMenuId: req.body.subMenuId,
      menuId: req.body.menuId,
      imageUrl: result.secure_url,
      sizes: sizes,
      isTrending: req.body.isTrending || false,
      isMainpage: req.body.isMainpage || false,

      // color: req.body.color,
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

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

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
    const product = await Product.findById(req.params.id);
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
    product.subMenuId = req.body.subMenuId;
    product.menuId = req.body.menuId;
    product.rating = req.body.rating;
    product.isTrending = req.body.isTrending || false;
    product.isMainpage = req.body.isMainpage || false;
    // product.color = req.body.color;

    // Update image if file is uploaded
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      fs.unlinkSync(req.file.path);
      product.imageUrl = result.secure_url;
    }

    // Parse and update sizes if sent
    if (req.body.sizes) {
      const sizes = JSON.parse(req.body.sizes);
      product.sizes = sizes.map((item) => ({
        size: item.size,
        // quantity: item.quantity,
      }));
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
// Get products by menu
const getProductsByMenu = async (req, res) => {
  try {
    const { menuId } = req.params;

    const products = await Product.find({ menuId });

    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found under this menu." });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products by menu:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// Get products by submenu
const getProductsBySubMenu = async (req, res) => {
  try {
    const { subMenuId } = req.params;

    const products = await Product.find({ subMenuId });

    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found under this submenu." });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products by submenu:", error);
    res.status(500).json({ message: "Server error." });
  }
};

const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Search query is required." });
    }

    // Split words for multi-keyword search
    const words = query.trim().split(/\s+/);

    // Create regex array to search for each word in multiple fields
    const regexFilters = words.map((word) => {
      const regex = new RegExp(word, "i"); // case-insensitive
      return {
        $or: [
          { name: regex },
          { heading: regex },
          { subheading: regex },
          { description: regex },
        ],
      };
    });

    const products = await Product.find({
      $and: regexFilters,
    });

    if (!products.length) {
      return res.status(404).json({ message: "No matching products found." });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// GET - Trending products
const getTrendingProducts = async (req, res) => {
  try {
    const trendingProducts = await Product.find({ isTrending: true })
      .populate("menuId")
      .populate("subMenuId");

    if (!trendingProducts.length) {
      return res.status(404).json({ message: "No trending products found" });
    }

    res.status(200).json(trendingProducts);
  } catch (error) {
    console.error("Error fetching trending products:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET - Products by menuId & isMainpage = true
const getMainpageProductsBySubMenuId = async (req, res) => {
  try {
    const { subMenuId } = req.params; // subMenuId will come from the route

    if (!subMenuId) {
      return res.status(400).json({ message: "subMenuId is required" });
    }

    const products = await Product.find({
      subMenuId: subMenuId,
      isMainpage: true,
    })
      .populate("menuId")
      .populate("subMenuId");

    if (!products.length) {
      return res
        .status(404)
        .json({ message: "No mainpage products found for this submenu" });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching mainpage products by submenu:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByMenu,
  getProductsBySubMenu,
  searchProducts,
  getTrendingProducts,
  getMainpageProductsBySubMenuId,
};
