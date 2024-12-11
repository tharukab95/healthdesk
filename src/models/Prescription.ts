import { Schema, model, models } from "mongoose";
import { Prescription } from "@/types";
import { medicationSchema } from "./schemas/Medication";

const prescriptionSchema = new Schema({
  appointmentId: {
    type: Schema.Types.ObjectId,
    ref: "Appointment",
    required: true,
  },
  medicines: [medicationSchema],
  instructions: { type: String, required: true },
});

export const PrescriptionModel =
  models.Prescription ||
  model<Prescription>("Prescription", prescriptionSchema);
