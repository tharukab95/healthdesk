import { Schema, model, models } from "mongoose";
import { Billing } from "@/types";
import { medicationCostSchema } from "./schemas/MedicationCost";

const billingSchema = new Schema({
  patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
  appointmentId: {
    type: Schema.Types.ObjectId,
    ref: "Appointment",
    required: true,
  },
  consultationFee: { type: Number, required: true },
  medicationCosts: [medicationCostSchema],
  totalAmount: { type: Number, required: true },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "cancelled"],
    default: "pending",
  },
  dateIssued: { type: Date, default: Date.now },
});

export const BillingModel =
  models.Billing || model<Billing>("Billing", billingSchema);
