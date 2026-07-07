import express from 'express';
import Wishlist from '../Models/Wishlist.js';
import Product from '../Models/Product.js';
import { protectUser } from '../Middlewares/protectUser.js';

const router = express.Router();

// ================= GET USER WISHLIST =================
router.get('/', protectUser, async (req, res) => {
  try {
    const items = await Wishlist.find({ userId: req.user._id })
      .populate('product', 'name price media category');

    res.json(items);
  } catch (err) {
    console.error('❌ Fetch Wishlist Error:', err.message);
    res.status(500).json({ message: 'Failed to fetch wishlist' });
  }
});

// ================= ADD TO WISHLIST =================
router.post('/', protectUser, async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        message: 'Product ID is required',
      });
    }

    // Check product exists
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
      });
    }

    // Prevent duplicates
    const exists = await Wishlist.findOne({
      userId: req.user._id,
      product: productId,
    });

    if (exists) {
      return res.status(400).json({
        message: 'Already wishlisted',
      });
    }

    const item = await Wishlist.create({
      userId: req.user._id,
      product: productId,
    });

    const populatedItem = await Wishlist.findById(item._id).populate(
      'product',
      'name price media category'
    );

    res.status(201).json(populatedItem);

  } catch (err) {
    console.error('❌ Wishlist POST Error:', err.message);

    res.status(500).json({
      message: 'Something went wrong',
    });
  }
});

// ================= REMOVE FROM WISHLIST =================
router.delete('/:productId', protectUser, async (req, res) => {
  try {
    const deleted = await Wishlist.findOneAndDelete({
      userId: req.user._id,
      product: req.params.productId,
    });

    if (!deleted) {
      return res.status(404).json({
        message: 'Wishlist item not found',
      });
    }

    res.json({
      message: 'Removed from wishlist',
    });

  } catch (err) {
    console.error('❌ Wishlist DELETE Error:', err.message);

    res.status(500).json({
      message: 'Failed to remove wishlist item',
    });
  }
});

export default router;