import { Schema, model, models } from "mongoose";
import { Appointment } from "@/types";

const appointmentSchema = new Schema({
  patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
  doctorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  appointmentDate: { type: Date, required: true },
  reasonForVisit: { type: String, required: true },
  prescriptionId: { type: Schema.Types.ObjectId, ref: "Prescription" },
});

export const AppointmentModel =
  models.Appointment || model<Appointment>("Appointment", appointmentSchema);
