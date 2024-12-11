import { Schema } from "mongoose";

export const medicationCostSchema = new Schema({
  medicineId: { type: Schema.Types.ObjectId, ref: "Medicine", required: true },
  cost: { type: Number, required: true },
});
