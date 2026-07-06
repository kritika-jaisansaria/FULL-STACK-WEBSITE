import express from 'express';
import { protectUser } from '../Middlewares/protectUser.js';
import { protectAdmin } from '../Middlewares/authMiddleware.js';
import {
  createOrder,
  getMyOrders,
  getMyOrderById,
  getAllOrders,
  updateOrderStatus,
} from '../Controllers/orderController.js';

const router = express.Router();

// Logged-in user routes
router.post('/', protectUser, createOrder);
router.get('/mine', protectUser, getMyOrders);
router.get('/mine/:id', protectUser, getMyOrderById);

// Admin routes
router.get('/', protectAdmin, getAllOrders);
router.put('/:id/status', protectAdmin, updateOrderStatus);

export default router;