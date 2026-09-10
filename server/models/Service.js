import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    type: {
      type: String,
      required: true,
      enum: ["General Service", "Filter Change", "RO Membrane", "Installation", "Other"],
    },
    date: { type: Date, required: true },
    amount: { type: Number, required: true, min: 0, default: 0 },
    nextDue: { type: Date },
    filtersChanged: [{ type: String }],
    notes: { type: String, trim: true, default: "" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

serviceSchema.index({ date: -1 });

export default mongoose.model("Service", serviceSchema);
