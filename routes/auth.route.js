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

router.post("/send", sendOTP);
router.post("/verify", verifyOTP);
router.get("/users", getAllUsers);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.get("/users/:id", getUserById);
module.exports = router;
