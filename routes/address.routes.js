const express = require("express");
const router = express.Router();
const addressController = require("../controllers/address.controller");

router.post("/:userId", addressController.createAddress);
router.get("/", addressController.getAllAddresses);
router.get("/:userId", addressController.getAddressById);
router.put("/:addressId", addressController.updateAddress);

router.delete("/:id", addressController.deleteAddress);

module.exports = router;
