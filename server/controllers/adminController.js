import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/User.js";
import Customer from "../models/Customer.js";
import Service from "../models/Service.js";
import Payment from "../models/Payment.js";
import ContactMessage from "../models/ContactMessage.js";
import { ApiFeatures } from "../utils/apiFeatures.js";

// @desc    High-level admin dashboard stats (users, content, messages)
// @route   GET /api/admin/overview
// @access  Private/Admin
export const getAdminOverview = asyncHandler(async (req, res) => {
  const [userCount, customerCount, serviceCount, paymentCount, newMessages] = await Promise.all([
    User.countDocuments(),
    Customer.countDocuments(),
    Service.countDocuments(),
    Payment.countDocuments(),
    ContactMessage.countDocuments({ status: "New" }),
  ]);
  res.json({
    success: true,
    data: { userCount, customerCount, serviceCount, paymentCount, newMessages },
  });
});

// @desc    List all users (admin user management)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  const features = new ApiFeatures(User.find(), req.query)
    .search(["name", "email"])
    .filter(["role"])
    .sort("-createdAt")
    .paginate();

  const [users, total] = await Promise.all([features.query, User.countDocuments()]);
  res.json({
    success: true,
    count: users.length,
    total,
    page: features.pagination.page,
    pages: Math.ceil(total / features.pagination.limit),
    data: users,
  });
});

// @desc    Update a user's role or active status
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
export const updateUser = asyncHandler(async (req, res) => {
  const { role, isActive, name, phone } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  if (role) user.role = role;
  if (typeof isActive === "boolean") user.isActive = isActive;
  if (name) user.name = name;
  if (phone) user.phone = phone;
  await user.save();
  res.json({ success: true, data: user });
});

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  if (req.params.id === String(req.user._id)) {
    res.status(400);
    throw new Error("You cannot delete your own account");
  }
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json({ success: true, message: "User deleted" });
});
