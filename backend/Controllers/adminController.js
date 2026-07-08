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
      recentOrders,
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

      Order.find()
        .populate("user", "name")
        .sort({ createdAt: -1 })
        .limit(5),
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
      recentOrders,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to fetch dashboard stats",
    });
  }
};

// =========================
// Get All Users
// =========================
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
};

// =========================
// Delete User
// =========================
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        message: "Admin cannot be deleted",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to delete user",
    });
  }
};