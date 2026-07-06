import jwt from 'jsonwebtoken';
import User from '../Models/User.js';

// Verifies the token AND requires role === 'admin'.
// Use this on any route that creates/updates/deletes store data
// (products, orders, etc.) — not on routes any logged-in user can hit.
export const protectAdmin = async (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Not authorized, no token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Token failed' });
  }
};
