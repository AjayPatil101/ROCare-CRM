import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Customer name is required"], trim: true },
    phone: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
      match: [/^[0-9+\-\s]{7,15}$/, "Please provide a valid phone number"],
    },
    address: { type: String, trim: true, default: "" },
    brand: { type: String, trim: true, default: "Not specified" },
    installDate: { type: Date, required: [true, "Installation date is required"] },
    lastServiceDate: { type: Date },
    nextDueDate: { type: Date, index: true },
    notes: { type: String, trim: true, default: "" },
    photoUrl: { type: String, default: "" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Speeds up name/phone search used by the customer list & global search
customerSchema.index({ name: "text", phone: "text" });

export default mongoose.model("Customer", customerSchema);
