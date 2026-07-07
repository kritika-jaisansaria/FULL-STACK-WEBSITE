import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, required: true, lowercase: true, trim: true },
    password: String,

    isVerified: { type: Boolean, default: false },

    // Used for both signup verification and login-via-OTP
    otp: String,
    otpExpires: Date,
    otpPurpose: { type: String, enum: ['signup', 'login', 'reset', null], default: null },

    role: { type: String, default: 'user' },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
