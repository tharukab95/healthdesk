import { Schema, model, models } from "mongoose";
import { Prescription } from "@/types";
import { prescribedMedicineSchema } from "./schemas/PrescribedMedicine";

const prescriptionSchema = new Schema({
  appointmentId: {
    type: Schema.Types.ObjectId,
    ref: "Appointment",
    required: true,
  },
  prescribedMedicines: [prescribedMedicineSchema],
  instructions: { type: String, required: true },
});

export const PrescriptionModel =
  models.Prescription ||
  model<Prescription>("Prescription", prescriptionSchema);
