const express = require("express");
const router = express.Router();
const {
  sendOTP,
  verifyOTP,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserById,
} = require("../controllers/auth.controller");
const authVerify = require("../middlewares/authverify");

router.post("/send", sendOTP);
router.post("/verify", verifyOTP);
router.get("/users", authVerify, getAllUsers);
router.put("/users/:id", authVerify, updateUser);
router.delete("/users/:id", authVerify, deleteUser);
router.get("/users/:id", authVerify, getUserById);
module.exports = router;
