import CartItem from '../Models/CartItem.js';

export const getCart = async (req, res) => {
  const cartItems = await CartItem.find({ user: req.user._id }).populate('product');
  res.json(cartItems);
};

export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  const existingItem = await CartItem.findOne({ user: req.user._id, product: productId });

  if (existingItem) {
    existingItem.quantity += quantity;
    await existingItem.save();
    return res.status(200).json(existingItem);
  }

  const newItem = new CartItem({
    user: req.user._id,
    product: productId,
    quantity,
  });

  await newItem.save();
  res.status(201).json(newItem);
};

export const updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;

  const item = await CartItem.findOne({ user: req.user._id, product: productId });
  if (!item) return res.status(404).json({ message: 'Item not found in cart' });

  item.quantity = quantity;
  await item.save();
  res.json(item);
};

export const removeFromCart = async (req, res) => {
  const { productId } = req.params;

  const item = await CartItem.findOneAndDelete({ user: req.user._id, product: productId });
  if (!item) return res.status(404).json({ message: 'Item not found in cart' });

  res.json({ message: 'Item removed' });
};

export const clearCart = async (req, res) => {
  await CartItem.deleteMany({ user: req.user._id });
  res.json({ message: 'Cart cleared' });
};
