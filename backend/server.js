import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import addressRoutes from './Routes/address.js';
import authRoutes from './Routes/auth.js';
import productRoutes from './Routes/productRoutes.js';
import userRoutes from "./Routes/userRoutes.js";
import wishlistRoutes from './Routes/wishlist.js';
import cartRoutes from './Routes/cartRoutes.js';
import orderRoutes from './Routes/orderRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGODB_URL;

if (!mongoURI) {
    console.error("❌ MONGODB_URL not defined in .env");
    process.exit(1);
}

mongoose.connect(mongoURI)
    .then(() => console.log("✅ Connected to MongoDB Atlas"))
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
    });

// Sample Route
app.get('/ping', (req, res) => {
    res.send('PONG');
});

// Routes
app.use('/api/users', authRoutes);
app.use('/api/products', productRoutes);
app.use("/api/users", userRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/orders', orderRoutes);

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});