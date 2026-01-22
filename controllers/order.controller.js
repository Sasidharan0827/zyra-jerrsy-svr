// const Order = require("../models/order.model");
// const Product = require("../models/product.model");
// const DesignTemplate = require("../models/designTemplate ");
// const cloudinary = require("../cloudinary/cloudinary ");
// // CREATE Order
// const createOrder = async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const { products, paymentMethod, designPrint, designId } = req.body;

//     if (
//       !userId ||
//       !products ||
//       !Array.isArray(products) ||
//       products.length === 0
//     ) {
//       return res.status(400).json({ message: "Invalid order data" });
//     }

//     let totalAmount = 0;

//     for (const item of products) {
//       const product = await Product.findById(item.productId);
//       if (!product)
//         return res.status(404).json({ message: "Product not found" });

//       totalAmount += product.price * item.quantity;
//     }

//     // Add ₹150 print charge if designPrint is true
//     if (designPrint) {
//       totalAmount += 150;
//     }

//     const newOrder = new Order({
//       userId,
//       products,
//       designPrint,
//       designId: designPrint ? designId : null,
//       totalAmount,
//       paymentMethod,
//     });

//     await newOrder.save();

//     // Return populated design details if available
//     const populatedOrder = await Order.findById(newOrder._id)
//       .populate("products.productId")
//       .populate("designId");

//     res
//       .status(201)
//       .json({ message: "Order placed successfully", order: populatedOrder });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // READ - Get all orders
// const getAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.find()
//       .populate("userId")
//       .populate("products.productId")
//       .populate("designId");

//     if (!orders || orders.length === 0) {
//       return res.status(404).json({ message: "No orders placed yet" });
//     }
//     res.json(orders);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // READ - Get user orders
// const getOrdersByUser = async (req, res) => {
//   try {
//     const orders = await Order.find({ userId: req.params.userId })
//       .populate("products.productId")
//       .populate("designId");

//     const filteredOrders = orders.map((order) => {
//       const filteredProducts = order.products.map((item) => ({
//         productId: {
//           _id: item.productId._id,
//           name: item.productId.name,
//           imageUrl: item.productId.imageUrl,
//           price: item.productId.price,
//           description: item.productId.description,
//           heading: item.productId.heading,
//           subheading: item.productId.subheading,
//           category: item.productId.category,
//           rating: item.productId.rating,
//         },
//         size: item.size,
//         quantity: item.quantity,
//       }));

//       return {
//         _id: order._id,
//         userId: order.userId,
//         products: filteredProducts,
//         designPrint: order.designPrint,
//         design: order.designId
//           ? {
//               _id: order.designId._id,
//               name: order.designId.name,
//               imageUrl: order.designId.imageUrl,
//               category: order.designId.category,
//             }
//           : null,
//         totalAmount: order.totalAmount,
//         paymentMethod: order.paymentMethod,
//         status: order.status,
//         createdAt: order.createdAt,
//       };
//     });

//     res.status(200).json(filteredOrders);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // UPDATE - Update order status or payment
// const updateOrder = async (req, res) => {
//   try {
//     const orderId = req.params.orderId;
//     const { status, paymentMethod, designPrint, designId } = req.body;

//     const updateData = { status, paymentMethod };

//     if (typeof designPrint === "boolean") updateData.designPrint = designPrint;
//     if (designId) updateData.designId = designId;

//     const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, {
//       new: true,
//     })
//       .populate("products.productId")
//       .populate("designId");

//     if (!updatedOrder)
//       return res.status(404).json({ message: "Order not found" });

//     res.json({ message: "Order updated", order: updatedOrder });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // CANCEL - Cancel order within 1 day
// const cancelOrder = async (req, res) => {
//   try {
//     const { userId, orderId } = req.params;

//     const order = await Order.findOne({ _id: orderId, userId });

//     if (!order) {
//       return res
//         .status(404)
//         .json({ message: "Order not found or unauthorized" });
//     }

//     if (order.status === "Cancelled") {
//       return res.status(400).json({ message: "Order is already cancelled" });
//     }

//     const orderTime = new Date(order.createdAt);
//     const now = new Date();
//     const timeDiff = (now - orderTime) / (1000 * 60 * 60); // in hours

//     if (timeDiff > 24) {
//       return res
//         .status(400)
//         .json({ message: "Cancellation window expired (1 day limit)" });
//     }

//     order.status = "Cancelled";
//     await order.save();

//     res.status(200).json({ message: "Order cancelled successfully", order });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // DELETE - Cancel/Delete an order
// const deleteOrder = async (req, res) => {
//   try {
//     const orderId = req.params.orderId;
//     const deleted = await Order.findByIdAndDelete(orderId);

//     if (!deleted) return res.status(404).json({ message: "Order not found" });

//     res.json({ message: "Order deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// module.exports = {
//   createOrder,
//   getAllOrders,
//   getOrdersByUser,
//   cancelOrder,
//   updateOrder,
//   deleteOrder,
// };

// controllers/order.controller.js
const Order = require("../models/order.model");
const Product = require("../models/product.model");
const DesignTemplate = require("../models/designTemplate ");
const razorpay = require("../config/razorpay");
const crypto = require("crypto");

/**
 * @desc Create order
 * @route POST /orders/create/:userId
 */
const createOrder = async (req, res) => {
  try {
    const { userId } = req.params;
    const { products, paymentMethod, address, designPrint, designId } =
      req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "No products in the order" });
    }

    // ✅ Calculate total amount from DB
    let totalAmount = 0;
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product not found: ${item.productId}` });
      }
      totalAmount += product.price * item.quantity;
    }

    // ✅ Add ₹150 if design print is selected
    if (designPrint) {
      totalAmount += 150;
    }

    // ✅ Reduce stock
    for (const item of products) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    // ✅ Handle online payment
    if (paymentMethod === "Online") {
      const options = {
        amount: totalAmount * 100, // Razorpay takes paise
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      };

      const paymentOrder = await razorpay.orders.create(options);

      return res.status(200).json({
        success: true,
        paymentOrder,
        calculatedTotal: totalAmount,
        message: "Proceed with online payment",
      });
    }

    // ✅ COD - Save directly
    const newOrder = new Order({
      userId,
      products,
      address,
      paymentMethod,
      totalAmount,
      status: "Placed",
      designPrint,
      designId: designPrint ? designId : null,
    });

    await newOrder.save();
    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ success: false, message: "Error creating order" });
  }
};

/**
 * @desc Verify Razorpay payment and save order in DB
 * @route POST /orders/payment/verify
 */
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      products,
      address,
      totalAmount,
      designTemplateId,
    } = req.body;

    // Check each field individually
    const errors = [];
    if (!razorpay_order_id) errors.push("Razorpay order ID is missing");
    if (!razorpay_payment_id) errors.push("Razorpay payment ID is missing");
    if (!razorpay_signature) errors.push("Razorpay signature is missing");
    if (!userId) errors.push("User ID is missing");
    if (!products) errors.push("Products are missing");
    if (!totalAmount) errors.push("Total amount is missing");

    // If there are any errors, return them
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        errors: errors,
      });
    }

    // Log the received payload for debugging
    console.log("Received Payload:", req.body);

    // Signature verification
    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    console.log("Received Razorpay Signature:", razorpay_signature);
    console.log("Generated Signature:", expectedSign);

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // Reduce stock
    await Promise.all(
      products.map((item) =>
        Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity },
        })
      )
    );

    // Get design template if provided
    let designTemplate = null;
    if (designTemplateId) {
      designTemplate = await DesignTemplate.findById(designTemplateId);
    }

    // Save order
    const newOrder = new Order({
      userId,
      products,

      address,
      paymentMethod: "Online",
      totalAmount,
      status: "Placed",
      designTemplate,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    });

    await newOrder.save();

    res.status(200).json({
      success: true,
      message: "Payment verified and order placed",
      order: newOrder,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({
      success: false,
      message: "Error verifying payment",
      error: error.message,
    });
  }
};

/**
 * @desc Get all orders for a user
 * @route GET /orders/:userId
 */
const getOrdersByUser = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const orders = await Order.find({ userId: req.params.userId })
      .populate("products.productId")
      .populate("designId") // Corrected field name
      .skip(skip)
      .limit(limit);
    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No orders found for this user" });
    }
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};

/**
 * @desc Update order status
 * @route PUT /orders/:id
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Update order status error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error updating order status" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("products.productId");
    Order.find().populate("designId");
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getOrdersByUser,
  updateOrderStatus,
  getAllOrders,
};
