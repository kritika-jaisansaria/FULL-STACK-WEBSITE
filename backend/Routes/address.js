// routes/address.js
import express from 'express';
import Address from '../Models/Address.js';
import { protectUser } from '../Middlewares/protectUser.js';

const router = express.Router();

// Add new address
router.post('/', protectUser, async (req, res) => {
  try {
    const { type, firstName, lastName, email, mobile, address1, address2, pincode, city, state } = req.body;

    const newAddress = new Address({
      userId: req.user._id,  // Assuming req.user is set by auth middleware
      type,
      firstName,
      lastName,
      email,
      mobile,
      address1,
      address2,
      pincode,
      city,
      state
    });

    const savedAddress = await newAddress.save();
    res.status(201).json(savedAddress);
  } catch (error) {
    res.status(500).json({ message: 'Failed to save address', error });
  }
});

// Get all addresses of logged-in user
router.get('/', protectUser, async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user._id });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get addresses', error });
  }
});

// Update an address
router.put('/:id', protectUser, async (req, res) => {
  try {
    const updated = await Address.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Address not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update address', error });
  }
});

// Delete an address
router.delete('/:id', protectUser, async (req, res) => {
  try {
    const deleted = await Address.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!deleted) return res.status(404).json({ message: 'Address not found' });
    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete address', error });
  }
});

export default router;