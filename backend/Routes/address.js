import express from "express";
import { protectUser } from "../Middlewares/protectUser.js";

import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} from "../Controllers/addressController.js";

const router = express.Router();

// Get all addresses
router.get("/", protectUser, getAddresses);

// Add new address
router.post("/", protectUser, addAddress);

// Update address
router.put("/:id", protectUser, updateAddress);

// Delete address
router.delete("/:id", protectUser, deleteAddress);

router.patch("/:id/default", protectUser, setDefaultAddress);

export default router;