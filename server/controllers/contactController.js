import asyncHandler from "../middleware/asyncHandler.js";
import ContactMessage from "../models/ContactMessage.js";
import { sendContactNotificationEmail } from "../services/emailService.js";
import { ApiFeatures } from "../utils/apiFeatures.js";

// @desc    Submit the public contact form
// @route   POST /api/contact
// @access  Public
export const submitContact = asyncHandler(async (req, res) => {
  const contact = await ContactMessage.create(req.body);

  const notifyEmail = process.env.SMTP_USER;
  if (notifyEmail) await sendContactNotificationEmail(notifyEmail, contact);

  res.status(201).json({ success: true, message: "Thanks! We'll get back to you shortly.", data: contact });
});

// @desc    Get all contact messages (admin inbox)
// @route   GET /api/contact
// @access  Private/Admin
export const getContactMessages = asyncHandler(async (req, res) => {
  const features = new ApiFeatures(ContactMessage.find(), req.query)
    .search(["name", "email", "subject"])
    .filter(["status"])
    .sort("-createdAt")
    .paginate();

  const [messages, total] = await Promise.all([features.query, ContactMessage.countDocuments()]);
  res.json({
    success: true,
    count: messages.length,
    total,
    page: features.pagination.page,
    pages: Math.ceil(total / features.pagination.limit),
    data: messages,
  });
});

// @desc    Update a message's status (New/Read/Resolved)
// @route   PUT /api/contact/:id
// @access  Private/Admin
export const updateContactMessage = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!message) {
    res.status(404);
    throw new Error("Message not found");
  }
  res.json({ success: true, data: message });
});

// @desc    Delete a contact message
// @route   DELETE /api/contact/:id
// @access  Private/Admin
export const deleteContactMessage = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findByIdAndDelete(req.params.id);
  if (!message) {
    res.status(404);
    throw new Error("Message not found");
  }
  res.json({ success: true, message: "Message deleted" });
});
