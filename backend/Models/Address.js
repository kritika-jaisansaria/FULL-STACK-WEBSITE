// models/Address.js
import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['shipping', 'billing'], required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  address1: { type: String, required: true },
  address2: { type: String },
  pincode: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Address', addressSchema);