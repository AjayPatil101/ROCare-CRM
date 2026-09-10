import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
    date: { type: Date, required: true },
    amount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ["Paid", "Pending"], default: "Pending" },
    method: { type: String, enum: ["Cash", "UPI", "Card", "Bank Transfer", "Other"], default: "Cash" },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
