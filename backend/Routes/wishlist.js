import express from 'express';
const router = express.Router();
import { protectUser } from '../Middlewares/protectUser.js';
import Wishlist from '../Models/Wishlist.js';

// All wishlist routes now use `protectUser`
router.get('/', protectUser, async (req, res) => {
  const items = await Wishlist.find({ userId: req.user._id }).populate('product');
  res.json(items);
});

router.post('/', protectUser, async (req, res) => {
  const { productId } = req.body;

  try {
    const exists = await Wishlist.findOne({
      userId: req.user._id,
      product: productId,
    });

    if (exists) {
      return res.status(400).json({ message: 'Already wishlisted' });
    }

    const item = await Wishlist.create({
      userId: req.user._id,
      product: productId,
    });

    const populatedItem = await Wishlist.findById(item._id).populate('product');
    res.status(201).json(populatedItem);
  } catch (err) {
    console.error("❌ Wishlist POST error:", err.message);
    res.status(500).json({ message: 'Something went wrong' });
  }
});


router.delete('/:productId', protectUser, async (req, res) => {
  await Wishlist.findOneAndDelete({ userId: req.user._id, product: req.params.productId });
  res.json({ message: 'Removed from wishlist' });
});

export default router;
