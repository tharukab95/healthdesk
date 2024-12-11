import { Schema, model, models } from "mongoose";
import { Patient } from "@/types";

const patientSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  contactNumber: { type: String, required: false },
  age: { type: Number, required: true },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
  },
  address: { type: String, required: false },
  allergies: { type: [String], required: false },
  medicalHistory: [{ type: Schema.Types.ObjectId, ref: "Appointment" }],
});

export const PatientModel =
  models.Patient || model<Patient>("Patient", patientSchema);
