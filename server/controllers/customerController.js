import asyncHandler from "../middleware/asyncHandler.js";
import Customer from "../models/Customer.js";
import Service from "../models/Service.js";
import Payment from "../models/Payment.js";
import { ApiFeatures } from "../utils/apiFeatures.js";

// @desc    Get all customers (search + pagination)
// @route   GET /api/customers
// @access  Private
export const getCustomers = asyncHandler(async (req, res) => {
  const baseQuery = Customer.find();
  const features = new ApiFeatures(baseQuery, req.query)
    .search(["name", "phone", "address"])
    .sort("-createdAt")
    .paginate();

  const [customers, total] = await Promise.all([
    features.query,
    new ApiFeatures(Customer.find(), req.query).search(["name", "phone", "address"]).query.countDocuments(),
  ]);

  res.json({
    success: true,
    count: customers.length,
    total,
    page: features.pagination.page,
    pages: Math.ceil(total / features.pagination.limit),
    data: customers,
  });
});

// @desc    Get single customer with service & payment history
// @route   GET /api/customers/:id
// @access  Private
export const getCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    res.status(404);
    throw new Error("Customer not found");
  }

  const [services, payments] = await Promise.all([
    Service.find({ customer: customer._id }).sort("-date"),
    Payment.find({ customer: customer._id }).sort("-date"),
  ]);

  const totalPaid = payments.filter((p) => p.status === "Paid").reduce((a, p) => a + p.amount, 0);
  const totalDue = payments.filter((p) => p.status === "Pending").reduce((a, p) => a + p.amount, 0);

  res.json({
    success: true,
    data: { customer, services, payments, summary: { totalPaid, totalDue, totalServices: services.length } },
  });
});

// @desc    Create a customer
// @route   POST /api/customers
// @access  Private
export const createCustomer = asyncHandler(async (req, res) => {
  const payload = { ...req.body, createdBy: req.user._id };
  if (req.file) payload.photoUrl = `/uploads/${req.file.filename}`;
  const customer = await Customer.create(payload);
  res.status(201).json({ success: true, data: customer });
});

// @desc    Update a customer
// @route   PUT /api/customers/:id
// @access  Private
export const updateCustomer = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (req.file) payload.photoUrl = `/uploads/${req.file.filename}`;

  const customer = await Customer.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });
  if (!customer) {
    res.status(404);
    throw new Error("Customer not found");
  }
  res.json({ success: true, data: customer });
});

// @desc    Delete a customer
// @route   DELETE /api/customers/:id
// @access  Private/Admin
export const deleteCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer) {
    res.status(404);
    throw new Error("Customer not found");
  }
  // Clean up related records so reports/dashboards stay accurate
  await Promise.all([
    Service.deleteMany({ customer: customer._id }),
    Payment.deleteMany({ customer: customer._id }),
  ]);
  res.json({ success: true, message: "Customer and related records deleted" });
});

// @desc    Get customers due for reminders (today / week / month / all)
// @route   GET /api/customers/reminders/:range
// @access  Private
export const getReminders = asyncHandler(async (req, res) => {
  const { range } = req.params; // today | week | month | all
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const filter = {};

  if (range === "today") {
    const endOfToday = new Date(startOfToday);
    endOfToday.setDate(endOfToday.getDate() + 1);
    filter.nextDueDate = { $gte: startOfToday, $lt: endOfToday };
  } else if (range === "week") {
    const weekEnd = new Date(startOfToday);
    weekEnd.setDate(weekEnd.getDate() + 7);
    filter.nextDueDate = { $gte: startOfToday, $lte: weekEnd };
  } else if (range === "month") {
    const monthEnd = new Date(startOfToday);
    monthEnd.setDate(monthEnd.getDate() + 30);
    filter.nextDueDate = { $gte: startOfToday, $lte: monthEnd };
  }

  const customers = await Customer.find(filter).sort("nextDueDate");
  res.json({ success: true, count: customers.length, data: customers });
});
