import { Schema } from "mongoose";

export const prescribedMedicineSchema = new Schema({
  medicineId: { type: Schema.Types.ObjectId, ref: "Medicine", required: true },
  frequency: { type: String, required: true },
  duration: { type: String, required: true },
});
