import { Schema, model, models } from "mongoose";
import { Medicine } from "@/types";

const medicineSchema = new Schema({
  name: { type: String, required: true },
  dosageForm: { type: String, required: true },
  strength: { type: String, required: true },
  unitMeasurement: { type: String, required: true },
  currentStock: { type: Number, required: true },
  reorderThreshold: { type: Number, required: true },
});

export const MedicineModel =
  models.Medicine || model<Medicine>("Medicine", medicineSchema);
