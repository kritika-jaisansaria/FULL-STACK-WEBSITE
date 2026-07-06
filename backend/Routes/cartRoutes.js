import express from 'express';
import { protectUser } from '../Middlewares/protectUser.js';
import {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart
} from '../Controllers/cartController.js';

const router = express.Router();

router.get('/', protectUser, getCart);
router.post('/add', protectUser, addToCart);
router.put('/update', protectUser, updateCartItem);
router.delete('/remove/:productId', protectUser, removeFromCart);
router.delete('/clear', protectUser, clearCart);

export default router;
