import asyncHandler from "../middleware/asyncHandler.js";
import Payment from "../models/Payment.js";
import { ApiFeatures } from "../utils/apiFeatures.js";

// @desc    Get all payments (filter by status, paginated)
// @route   GET /api/payments
// @access  Private
export const getPayments = asyncHandler(async (req, res) => {
  const features = new ApiFeatures(Payment.find().populate("customer", "name phone"), req.query)
    .filter(["status"])
    .sort("-date")
    .paginate();

  const [payments, total, pendingAgg] = await Promise.all([
    features.query,
    Payment.countDocuments(),
    Payment.aggregate([
      { $match: { status: "Pending" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
  ]);

  res.json({
    success: true,
    count: payments.length,
    total,
    page: features.pagination.page,
    pages: Math.ceil(total / features.pagination.limit),
    pendingTotal: pendingAgg[0]?.total || 0,
    data: payments,
  });
});

// @desc    Create a manual payment record
// @route   POST /api/payments
// @access  Private
export const createPayment = asyncHandler(async (req, res) => {
  const payment = await Payment.create(req.body);
  res.status(201).json({ success: true, data: payment });
});

// @desc    Update a payment (e.g. mark as Paid)
// @route   PUT /api/payments/:id
// @access  Private
export const updatePayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!payment) {
    res.status(404);
    throw new Error("Payment not found");
  }
  res.json({ success: true, data: payment });
});

// @desc    Delete a payment
// @route   DELETE /api/payments/:id
// @access  Private/Admin
export const deletePayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findByIdAndDelete(req.params.id);
  if (!payment) {
    res.status(404);
    throw new Error("Payment not found");
  }
  res.json({ success: true, message: "Payment deleted" });
});
