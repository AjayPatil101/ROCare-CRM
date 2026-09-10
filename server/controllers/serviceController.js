import asyncHandler from "../middleware/asyncHandler.js";
import Service from "../models/Service.js";
import Customer from "../models/Customer.js";
import Payment from "../models/Payment.js";
import { ApiFeatures } from "../utils/apiFeatures.js";

const addMonths = (date, n) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + n);
  return d;
};

// @desc    Get all services (paginated)
// @route   GET /api/services
// @access  Private
export const getServices = asyncHandler(async (req, res) => {
  const features = new ApiFeatures(Service.find().populate("customer", "name phone"), req.query)
    .filter(["type"])
    .sort("-date")
    .paginate();

  const [services, total] = await Promise.all([features.query, Service.countDocuments()]);

  res.json({
    success: true,
    count: services.length,
    total,
    page: features.pagination.page,
    pages: Math.ceil(total / features.pagination.limit),
    data: services,
  });
});

// @desc    Create a service visit; also updates the customer's due date and
//          creates a corresponding (pending) payment record.
// @route   POST /api/services
// @access  Private
export const createService = asyncHandler(async (req, res) => {
  const { customer, type, date, amount, filtersChanged, notes } = req.body;

  const customerDoc = await Customer.findById(customer);
  if (!customerDoc) {
    res.status(404);
    throw new Error("Customer not found");
  }

  const nextDue = addMonths(date, 3);

  const service = await Service.create({
    customer,
    type,
    date,
    amount,
    nextDue,
    filtersChanged,
    notes,
    createdBy: req.user._id,
  });

  customerDoc.lastServiceDate = date;
  customerDoc.nextDueDate = nextDue;
  await customerDoc.save();

  await Payment.create({
    customer,
    service: service._id,
    date,
    amount,
    status: "Pending",
  });

  res.status(201).json({ success: true, data: service });
});

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private
export const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!service) {
    res.status(404);
    throw new Error("Service not found");
  }
  res.json({ success: true, data: service });
});

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private/Admin
export const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) {
    res.status(404);
    throw new Error("Service not found");
  }
  res.json({ success: true, message: "Service deleted" });
});
