const twilioClient = require("../twillo/twilioClient");
const User = require("../models/auth.model");
const jwt = require("jsonwebtoken");
const Address = require("../models/address.model");
const Wishlist = require("../models/wishlist.model");
const Order = require("../models/order.model");
const otpStore = new Map();
// Generate 6-digit OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const sendOTP = async (req, res) => {
  const { phone } = req.body;

  const otp = generateOTP();

  // Store OTP temporarily (replace with Redis or DB in production)
  otpStore.set(phone, { otp, expiresAt: Date.now() + 5 * 60 * 1000 }); // 5 minutes expiry

  try {
    const message = await twilioClient.messages.create({
      body: ` 🔖Your Zyra  Account Verification  OTP is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${phone}`,
    });

    res
      .status(200)
      .json({ message: "OTP sent successfully", sid: message.sid });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const verifyOTP = async (req, res) => {
  const { phone, code } = req.body;

  const data = otpStore.get(phone);

  if (!data || Date.now() > data.expiresAt) {
    return res.status(400).json({ message: "OTP expired or not found" });
  }

  if (data.otp !== code) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  // OTP is valid
  otpStore.delete(phone); // Optional: clean up used OTP

  try {
    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({ phone });
    }

    const token = jwt.sign(
      { id: user._id, phone: user.phone },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({ message: "OTP verified", token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    // Fetch addresses for each user
    const usersWithAddress = await Promise.all(
      users.map(async (user) => {
        const address = await Address.findOne({ userId: user._id });
        const like = await Wishlist.findOne({ userId: user._id });
        const order = await Order.findOne({ userId: user._id });
        return {
          user,
          address: address || null,
          Wishlist: like || null,
          Orders: order || null,
        };
      })
    );

    res.status(200).json(usersWithAddress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Update user by ID
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { phone } = req.body;

  try {
    const user = await User.findByIdAndUpdate(id, { phone }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User updated", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete user by ID
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; // Get user by ID and include address
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    // 1. Find the user by ID
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. Find the address linked to this user
    const address = await Address.findOne({ userId });
    const order = await Order.findOne({ userId: user._id });
    const like = await Wishlist.findOne({ userId: user._id });

    // 3. Return both
    res.status(200).json({
      user,
      address: address || null, // if no address, return null
      Wishlist: like || null,
      Orders: order || null,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
  getAllUsers,
  updateUser,
  getUserById,
  deleteUser,
};
