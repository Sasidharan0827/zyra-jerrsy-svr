const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

// ✅ Create Cart
const createCart = async (req, res) => {
  try {
    const { userId } = req.params; // take userId from params
    const { items } = req.body; // items come from body

    let totalPrice = 0;
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product)
        return res.status(404).json({ message: "Product not found" });
      totalPrice += product.price * (item.quantity || 1);
    }

    const cart = new Cart({ userId, items, totalPrice });
    await cart.save();

    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Read All Carts
const getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find().populate("items.productId");
    if (!carts || carts.length === 0) {
      return res.status(404).json({ message: "No carts found" });
    }

    const nonEmptyCarts = carts.filter((cart) => cart.items.length > 0);
    if (nonEmptyCarts.length === 0) {
      return res.status(200).json({ message: "All carts are empty" });
    }

    res.status(200).json(nonEmptyCarts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Read Cart by User
const getCartByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) return res.status(404).json({ message: "Cart not found" });
    if (!cart.items || cart.items.length === 0) {
      return res.status(200).json({ message: "Cart is empty" });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update Cart
const updateCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const { items } = req.body;

    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = items;

    let totalPrice = 0;
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product)
        return res.status(404).json({ message: "Product not found" });
      totalPrice += product.price * (item.quantity || 1);
    }
    cart.totalPrice = totalPrice;

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete Cart
const deleteCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOneAndDelete({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    res.status(200).json({ message: "Cart deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCart,
  getAllCarts,
  getCartByUser,
  updateCart,
  deleteCart,
};
