import User from '../Models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generateOTP } from '../utils/generateOTP.js';
import { sendOtpEmail } from '../utils/sendEmail.js';

const OTP_VALID_MS = 5 * 60 * 1000; // 5 minutes

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  token: generateToken(user._id),
});

/* ================= REGISTER (STEP 1: create + send OTP) ================= */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const existing = await User.findOne({ email });

    if (existing && existing.isVerified) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    if (existing && !existing.isVerified) {
      // User signed up before but never verified — update details & resend OTP
      existing.name = name;
      existing.password = hashed;
      existing.otp = otp;
      existing.otpExpires = Date.now() + OTP_VALID_MS;
      existing.otpPurpose = 'signup';
      await existing.save();
    } else {
      await User.create({
        name,
        email,
        password: hashed,
        isVerified: false,
        otp,
        otpExpires: Date.now() + OTP_VALID_MS,
        otpPurpose: 'signup',
      });
    }

    await sendOtpEmail(email, otp, 'signup');

    res.json({ message: 'OTP sent to your email. Please verify to complete sign up.', email });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};

/* ================= VERIFY SIGNUP OTP (STEP 2: activate account) ================= */
export const verifySignupOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (
      !user ||
      user.otpPurpose !== 'signup' ||
      user.otp !== otp ||
      !user.otpExpires ||
      user.otpExpires < Date.now()
    ) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    user.otpPurpose = null;
    await user.save();

    res.json(publicUser(user));
  } catch (err) {
    console.error('Verify signup OTP error:', err);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};

/* ================= RESEND OTP (signup / login / reset) ================= */
export const resendOtp = async (req, res) => {
  try {
    const { email, purpose } = req.body; // purpose: 'signup' | 'login' | 'reset'
    const validPurposes = ['signup', 'login', 'reset'];

    if (!validPurposes.includes(purpose)) {
      return res.status(400).json({ message: 'Invalid OTP purpose' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No account found with this email' });

    if (purpose !== 'signup' && !user.isVerified) {
      return res.status(400).json({ message: 'Please complete sign up verification first' });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + OTP_VALID_MS;
    user.otpPurpose = purpose;
    await user.save();

    await sendOtpEmail(email, otp, purpose);

    res.json({ message: 'OTP resent to your email' });
  } catch (err) {
    console.error('Resend OTP error:', err);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};

/* ================= LOGIN (PASSWORD) ================= */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email before logging in', email });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid email or password' });

    res.json(publicUser(user));
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};

/* ================= SEND OTP FOR LOGIN (existing verified users) ================= */
export const sendLoginOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No account found with this email' });

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please complete sign up verification first', email });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + OTP_VALID_MS;
    user.otpPurpose = 'login';
    await user.save();

    await sendOtpEmail(email, otp, 'login');

    res.json({ message: 'OTP sent to your email' });
  } catch (err) {
    console.error('Send login OTP error:', err);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};

/* ================= LOGIN WITH OTP ================= */
export const loginWithOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (
      !user ||
      user.otpPurpose !== 'login' ||
      user.otp !== otp ||
      !user.otpExpires ||
      user.otpExpires < Date.now()
    ) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.otp = null;
    user.otpExpires = null;
    user.otpPurpose = null;
    await user.save();

    res.json(publicUser(user));
  } catch (err) {
    console.error('Login OTP error:', err);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};

/* ================= FORGOT PASSWORD (send reset OTP) ================= */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No account found with this email' });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + OTP_VALID_MS;
    user.otpPurpose = 'reset';
    await user.save();

    await sendOtpEmail(email, otp, 'reset');

    res.json({ message: 'Password reset OTP sent to your email' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};

/* ================= RESET PASSWORD (verify OTP + set new password) ================= */
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const user = await User.findOne({ email });
    if (
      !user ||
      user.otpPurpose !== 'reset' ||
      user.otp !== otp ||
      !user.otpExpires ||
      user.otpExpires < Date.now()
    ) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = null;
    user.otpExpires = null;
    user.otpPurpose = null;
    await user.save();

    res.json({ message: 'Password reset successful. Please log in with your new password.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};
