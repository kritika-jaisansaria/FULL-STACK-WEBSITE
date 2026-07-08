import Order from '../Models/Order.js';
import CartItem from '../Models/CartItem.js';

// Create a new order from the logged-in user's current cart
export const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentId, deliveryCharge, discount } = req.body;

    if (
    !shippingAddress ||
    !shippingAddress.firstName ||
    !shippingAddress.mobile ||
    !shippingAddress.address1
) {
      return res.status(400).json({ message: 'Shipping address is required' });
    }

    const cartItems = await CartItem.find({ user: req.user._id }).populate("product", "name price media");

    if (!cartItems.length) {
      return res.status(400).json({ message: 'Your cart is empty' });
    }

    const items = cartItems.map(item => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    }));

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      totalAmount,
      deliveryCharge: deliveryCharge || 0,
      discount: discount || 0,
      paymentMethod: paymentId ? 'Razorpay' : 'COD',
      paymentId: paymentId || undefined,
      paymentStatus: paymentId ? 'paid' : 'pending',
    });

    // Clear the cart now that the order has been placed
    await CartItem.deleteMany({ user: req.user._id });

    res.status(201).json(order);
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ message: 'Failed to place order', error: err.message });
  }
};

// Get the logged-in user's own orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
  .populate("items.product")
  .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
};

// Get a single order (must belong to the logged-in user)
export const getMyOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id }).populate("items.product","name media")
  .sort({ createdAt: -1 });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error('Error fetching order:', err);
    res.status(500).json({ message: 'Failed to fetch order', error: err.message });
  }
};

// Admin: get all orders across all users
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name media")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("Error fetching all orders:", err);
    res.status(500).json({
      message: "Failed to fetch orders",
      error: err.message,
    });
  }
};

// Admin: get a single order by id (any user's order)
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error('Error fetching order:', err);
    res.status(500).json({ message: 'Failed to fetch order', error: err.message });
  }
};

// Admin: update an order's status (pending -> confirmed -> processing -> shipped -> delivered)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }
    if (
    order.orderStatus === "delivered" &&
    orderStatus === "cancelled"
) {
    return res.status(400).json({
        message: "Delivered orders cannot be cancelled."
    });
}

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: { orderStatus },
        $push: { statusHistory: { status: orderStatus } },
      },
      { new: true }
    ).populate('user', 'name email');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json(order);
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ message: 'Failed to update order', error: err.message });
  }
};

// Admin: delete an order
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    console.error('Error deleting order:', err);
    res.status(500).json({ message: 'Failed to delete order', error: err.message });
  }
};