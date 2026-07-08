import express from 'express';
import { protectUser } from '../Middlewares/protectUser.js';
import { protectAdmin } from '../Middlewares/authMiddleware.js';
import {
  createOrder,
  getMyOrders,
  getMyOrderById,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from '../Controllers/orderController.js';

const router = express.Router();

// Logged-in user routes
router.post('/', protectUser, createOrder);
router.get('/mine', protectUser, getMyOrders);
router.get('/mine/:id', protectUser, getMyOrderById);

// Admin routes
router.get('/', protectAdmin, getAllOrders);
router.get('/:id', protectAdmin, getOrderById);
router.patch('/:id/status', protectAdmin, updateOrderStatus);
router.delete('/:id', protectAdmin, deleteOrder);

export default router;