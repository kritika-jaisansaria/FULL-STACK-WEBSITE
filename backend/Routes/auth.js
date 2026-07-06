import express from 'express';
import {
  registerUser,
  verifySignupOtp,
  resendOtp,
  loginUser,
  sendLoginOtp,
  loginWithOtp,
  forgotPassword,
  resetPassword,
} from '../Controllers/authController.js';

const router = express.Router();

// Signup flow
router.post('/register', registerUser);
router.post('/verify-signup-otp', verifySignupOtp);
router.post('/resend-otp', resendOtp);

// Login flow
router.post('/login', loginUser);
router.post('/send-login-otp', sendLoginOtp);
router.post('/login-otp', loginWithOtp);

// Forgot / reset password flow
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
