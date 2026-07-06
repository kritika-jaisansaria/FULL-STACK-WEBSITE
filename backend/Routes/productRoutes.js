import express from 'express';
import Product from '../Models/Product.js';
import { protectAdmin } from '../Middlewares/authMiddleware.js';
import {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProductById,
} from '../Controllers/productController.js';

const router = express.Router();

// Create Product
router.post('/', protectAdmin, createProduct);

// Get All Products
router.get('/', getAllProducts);

// Recommended products (kept here since it's route-specific logic)
router.get('/recommended/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const currentProduct = await Product.findById(id);
    if (!currentProduct) return res.status(404).json({ error: 'Product not found' });

    const { jewelleryType } = currentProduct.generalDetails || {};
    const { metal } = currentProduct.metalDetails || {};

    const recommended = await Product.find({
      _id: { $ne: id },
      'generalDetails.jewelleryType': jewelleryType,
      'metalDetails.metal': metal,
    }).limit(10);

    res.json(recommended);
  } catch (err) {
    console.error('Recommendation Error:', err);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

// Get One Product
router.get('/:id', getProductById);

// Update Product
router.put('/:id', protectAdmin, updateProduct);

// Delete Product
router.delete('/:id', protectAdmin, deleteProduct);

export default router;