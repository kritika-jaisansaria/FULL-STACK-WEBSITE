import express from "express";
import User from "../Models/User.js";

const router = express.Router();

// Get all users
router.get("/", async (req, res) => {
  try {
    const { q, role, page = 1, limit = 10 } = req.query;

    const filter = {};

    // Search by name or email
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
      ];
    }

    // Filter by role
    if (role) {
      filter.role = role;
    }

    const users = await User.find(filter)
      .select("-password -otp -otpExpires -otpPurpose")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalUsers = await User.countDocuments(filter);

    res.json({
      users,
      currentPage: Number(page),
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
});

// Get single user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password -otp -otpExpires -otpPurpose");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to fetch user",
    });
  }
});

// Delete user
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Prevent deleting the last admin
    if (user.role === "admin") {
      const adminCount = await User.countDocuments({
        role: "admin",
      });

      if (adminCount === 1) {
        return res.status(403).json({
          message: "Cannot delete the last administrator.",
        });
      }
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      message: "User deleted successfully.",
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to delete user.",
    });
  }
});

// Update user role
router.patch("/:id/role", async (req, res) => {
  try {
    const { role } = req.body;

    // Only allow valid roles
    if (!["admin", "user"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role.",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // Prevent removing the last admin
    if (user.role === "admin" && role === "user") {
      const adminCount = await User.countDocuments({
        role: "admin",
      });

      if (adminCount === 1) {
        return res.status(403).json({
          message: "Cannot remove the last administrator.",
        });
      }
    }

    user.role = role;

    await user.save();

    res.json({
      message: "User role updated successfully.",
      user,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to update user role.",
    });
  }
});
// Update user details
router.put("/:id", async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // Check if email already belongs to another user
    if (email && email !== user.email) {
      const existing = await User.findOne({ email });

      if (existing) {
        return res.status(400).json({
          message: "Email already exists.",
        });
      }
    }

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    res.json({
      message: "User updated successfully.",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });

  } 
  catch (err) {
  console.error(err);

  res.status(500).json({
    message: "Failed to update user.",
  });
}
});

export default router;