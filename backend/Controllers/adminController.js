import User from "../Models/User.js";
import Product from "../Models/Product.js";
import Order from "../Models/Order.js";

export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalAdmins,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
      revenue,
    ] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments({ role: "admin" }),
      Order.countDocuments({ orderStatus: "pending" }),
      Order.countDocuments({ orderStatus: "delivered" }),
      Order.countDocuments({ orderStatus: "cancelled" }),

      Order.aggregate([
        {
          $match: {
            paymentStatus: "paid",
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$finalAmount",
            },
          },
        },
      ]),
    ]);

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalAdmins,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue: revenue[0]?.totalRevenue || 0,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to fetch dashboard stats",
    });
  }
};