import CartItem from '../Models/CartItem.js';
import Product from '../Models/Product.js';

// ================= GET USER CART =================
export const getCart = async (req, res) => {
  try {
    const cartItems = await CartItem.find({
      user: req.user._id,
    }).populate('product', 'name price media');

    res.json(cartItems);
  } catch (error) {
    console.error('Get Cart Error:', error);

    res.status(500).json({
      message: 'Failed to fetch cart',
      error: error.message,
    });
  }
};

// ================= ADD TO CART =================
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({
        message: 'Product ID is required',
      });
    }

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        message: 'Quantity must be at least 1',
      });
    }

    // Check product exists
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
      });
    }

    // Check if already in cart
    const existingItem = await CartItem.findOne({
      user: req.user._id,
      product: productId,
    });

    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();

      const updatedItem = await CartItem.findById(existingItem._id)
        .populate('product', 'name price media');

      return res.status(200).json(updatedItem);
    }

    // Create new cart item
    const newItem = await CartItem.create({
      user: req.user._id,
      product: productId,
      quantity,
    });

    const populatedItem = await CartItem.findById(newItem._id)
      .populate('product', 'name price media');

    res.status(201).json(populatedItem);

  } catch (error) {
    console.error('Add Cart Error:', error);

    res.status(500).json({
      message: 'Failed to add item to cart',
      error: error.message,
    });
  }
};

// ================= UPDATE CART ITEM =================
export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({
        message: 'Product ID is required',
      });
    }

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        message: 'Quantity must be at least 1',
      });
    }

    const item = await CartItem.findOne({
      user: req.user._id,
      product: productId,
    });

    if (!item) {
      return res.status(404).json({
        message: 'Item not found in cart',
      });
    }

    item.quantity = quantity;
    await item.save();

    const updatedItem = await CartItem.findById(item._id)
      .populate('product', 'name price media');

    res.json(updatedItem);

  } catch (error) {
    console.error('Update Cart Error:', error);

    res.status(500).json({
      message: 'Failed to update cart item',
      error: error.message,
    });
  }
};

// ================= REMOVE FROM CART =================
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const item = await CartItem.findOneAndDelete({
      user: req.user._id,
      product: productId,
    });

    if (!item) {
      return res.status(404).json({
        message: 'Item not found in cart',
      });
    }

    res.json({
      message: 'Item removed from cart',
    });

  } catch (error) {
    console.error('Remove Cart Error:', error);

    res.status(500).json({
      message: 'Failed to remove item',
      error: error.message,
    });
  }
};

// ================= CLEAR CART =================
export const clearCart = async (req, res) => {
  try {
    await CartItem.deleteMany({
      user: req.user._id,
    });

    res.json({
      message: 'Cart cleared successfully',
    });

  } catch (error) {
    console.error('Clear Cart Error:', error);

    res.status(500).json({
      message: 'Failed to clear cart',
      error: error.message,
    });
  }
};