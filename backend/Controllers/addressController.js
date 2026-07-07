import Address from "../Models/Address.js";

// =======================
// Get All Addresses
// =======================
export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({
      userId: req.user._id,
    }).sort({
      isDefault: -1,
      createdAt: -1,
    });

    res.status(200).json(addresses);
  } catch (error) {
    console.error("Get Addresses:", error);

    res.status(500).json({
      message: "Failed to fetch addresses",
      error: error.message,
    });
  }
};

// =======================
// Add Address
// =======================
export const addAddress = async (req, res) => {
  try {
   const {
  addressType,
  firstName,
  lastName,
  email,
  mobile,
  address1,
  address2,
  city,
  state,
  pincode,
  isDefault,
} = req.body;

    // Basic Validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !mobile ||
      !address1 ||
      !city ||
      !state ||
      !pincode
    ) {
      return res.status(400).json({
        message: "Please fill all required fields.",
      });
    }

    // If new address is default,
    // remove default from previous addresses
    if (isDefault) {
      await Address.updateMany(
        { userId: req.user._id },
        { $set: { isDefault: false } }
      );
    }

    // Make first address default automatically
const existingAddresses = await Address.countDocuments({
  userId: req.user._id,
});

const makeDefault = existingAddresses === 0 ? true : isDefault;

    const address = await Address.create({
      userId: req.user._id,
      addressType,
      firstName,
      lastName,
      email,
      mobile,
      address1,
      address2,
      city,
      state,
      pincode,
      isDefault: makeDefault,
    });

    res.status(201).json(address);
  } catch (error) {
    console.error("Add Address:", error);

    res.status(500).json({
      message: "Failed to save address.",
      error: error.message,
    });
  }
};

// =======================
// Update Address
// =======================
export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.body.isDefault) {
      await Address.updateMany(
        { userId: req.user._id },
        { $set: { isDefault: false } }
      );
    }

    const updated = await Address.findOneAndUpdate(
      {
        _id: id,
        userId: req.user._id,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updated) {
      return res.status(404).json({
        message: "Address not found.",
      });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error("Update Address:", error);

    res.status(500).json({
      message: "Failed to update address.",
      error: error.message,
    });
  }
};

// =======================
// Delete Address
// =======================
export const deleteAddress = async (req, res) => {
  try {
    const deleted = await Address.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({
        message: "Address not found.",
      });
    }

    res.status(200).json({
      message: "Address deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Address:", error);

    res.status(500).json({
      message: "Failed to delete address.",
      error: error.message,
    });
  }
};

export const setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;

    // Remove default from all addresses
    await Address.updateMany(
      { userId: req.user._id },
      { $set: { isDefault: false } }
    );

    // Make selected address default
    const updated = await Address.findOneAndUpdate(
      {
        _id: id,
        userId: req.user._id,
      },
      {
        isDefault: true,
      },
      {
        new: true,
      }
    );

    if (!updated) {
      return res.status(404).json({
        message: "Address not found.",
      });
    }

    res.status(200).json(updated);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to set default address.",
      error: error.message,
    });
  }
};