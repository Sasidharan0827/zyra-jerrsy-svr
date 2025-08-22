const Address = require("../models/address.model");

// Create new address
const createAddress = async (req, res) => {
  try {
    const { userId } = req.params;

    const address = {
      name: req.body.name,
      addressLine: req.body.addressLine,
      city: req.body.city,
      state: req.body.state,
      postalCode: req.body.postalCode,
      country: req.body.country,
      secondary_phone: req.body.secondary_phone,
      phone: req.body.phone,
      userId: userId, // from params
    };
    const savedAddress = await Address.create(address);
    res.status(201).json(savedAddress);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all addresses (optionally filter by userId)
const getAllAddresses = async (req, res) => {
  try {
    const addresses = await Address.find(
      req.query.userId ? { userId: req.query.userId } : {}
    );
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single address by ID
const getAddressById = async (req, res) => {
  try {
    const address = await Address.find({ userId: req.params.userId });
    if (!address || address.length === 0)
      return res.status(404).json({ message: "Address not found" });
    res.json(address);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update an address by ID

const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const updatedAddress = await Address.findByIdAndUpdate(
      addressId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.status(200).json(updatedAddress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an address by ID and return the deleted object
const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findByIdAndDelete(req.params.id);
    if (!address) return res.status(404).json({ message: "Address not found" });
    res.json({
      message: "Address deleted successfully",
      deletedAddress: address,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createAddress,
  getAllAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
};
