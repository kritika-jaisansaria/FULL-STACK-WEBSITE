import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },       // snapshot at time of order
  price: { type: Number, required: true },       // snapshot at time of order
  quantity: { type: Number, required: true, min: 1 },
}, { _id: false });

const shippingAddressSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  address1: { type: String, required: true },
  address2: { type: String },
  pincode: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderNumber: {
    type: String,
    unique: true,
    required: true,
  },
  items: { type: [orderItemSchema], required: true },
  shippingAddress: { type: shippingAddressSchema, required: true },
  totalAmount: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ['COD', 'Razorpay'],
    default: 'COD',
  },
  deliveryCharge: {
    type: Number,
    default: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
  finalAmount: {
    type: Number,
    required: true,
  },
  estimatedDelivery: {
    type: Date,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
  paymentId: { type: String }, // Razorpay payment id, filled in later

  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  statusHistory: [
    {
      status: {
        type: String,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
}, { timestamps: true });

// Auto-fill fields the controller doesn't set explicitly, so document creation
// never fails validation just because these newer fields were left out.
// Runs before validators, so `required` checks on orderNumber/finalAmount pass.
orderSchema.pre('validate', function (next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).slice(2, 6).toUpperCase();
    this.orderNumber = `ORD-${timestamp}-${random}`;
  }

  if (this.finalAmount === undefined || this.finalAmount === null) {
    this.finalAmount = (this.totalAmount || 0) + (this.deliveryCharge || 0) - (this.discount || 0);
  }

  if (!this.statusHistory || this.statusHistory.length === 0) {
    this.statusHistory = [{ status: this.orderStatus || 'pending' }];
  }

  next();
});

export default mongoose.model('Order', orderSchema);