import express from "express";
import { protectAdmin } from "../Middlewares/authMiddleware.js";
import { getDashboardStats } from "../Controllers/adminController.js";

const router = express.Router();

router.get("/dashboard", protectAdmin, getDashboardStats);

export default router;