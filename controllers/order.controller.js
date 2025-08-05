const Order = require("../models/order.model");
const Product = require("../models/product.model");

// CREATE Order
const createOrder = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { products, paymentMethod } = req.body;

    if (
      !userId ||
      !products ||
      !Array.isArray(products) ||
      products.length === 0
    ) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    let totalAmount = 0;

    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product)
        return res.status(404).json({ message: "Product not found" });

      totalAmount += product.price * item.quantity;
    }

    const newOrder = new Order({
      userId,
      products,
      totalAmount,
      paymentMethod,
    });

    await newOrder.save();

    res
      .status(201)
      .json({ message: "Order placed successfully", order: newOrder });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ - Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId")
      .populate("products.productId");
    // If no orders exist, let the client know
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders placed yet" });
    }
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ - Get user orders
const getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).populate(
      "products.productId"
    );

    const filteredOrders = orders.map((order) => {
      const filteredProducts = order.products.map((item) => {
        return {
          productId: {
            _id: item.productId._id,
            name: item.productId.name,
            imageUrl: item.productId.imageUrl,
            price: item.productId.price,
            description: item.productId.description,
            heading: item.productId.heading,
            subheading: item.productId.subheading,
            category: item.productId.category,
            rating: item.productId.rating,
          },
          size: item.size,
          quantity: item.quantity,
        };
      });

      return {
        _id: order._id,
        userId: order.userId,
        products: filteredProducts,
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        status: order.status,
        createdAt: order.createdAt,
      };
    });

    res.status(200).json(filteredOrders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE - Update order status or payment
const updateOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { status, paymentMethod } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status, paymentMethod },
      { new: true }
    );

    if (!updatedOrder)
      return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order updated", order: updatedOrder });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CANCEL - Cancel order within 1 day
const cancelOrder = async (req, res) => {
  try {
    const { userId, orderId } = req.params;

    const order = await Order.findOne({ _id: orderId, userId });

    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found or unauthorized" });
    }

    if (order.status === "Cancelled") {
      return res.status(400).json({ message: "Order is already cancelled" });
    }

    const orderTime = new Date(order.createdAt);
    const now = new Date();
    const timeDiff = (now - orderTime) / (1000 * 60 * 60); // in hours

    if (timeDiff > 24) {
      return res
        .status(400)
        .json({ message: "Cancellation window expired (1 day limit)" });
    }

    order.status = "Cancelled";
    await order.save();

    res.status(200).json({ message: "Order cancelled successfully", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE - Cancel/Delete an order
const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const deleted = await Order.findByIdAndDelete(orderId);

    if (!deleted) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrdersByUser,
  cancelOrder,
  updateOrder,
  deleteOrder,
};
