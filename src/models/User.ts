import { Schema, model, models } from "mongoose";
import { User } from "@/types";

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String },
  emailVerified: { type: Date },
  role: {
    type: String,
    enum: ["admin", "doctor", "dispenser"],
    required: true,
  },
  isActive: { type: Boolean, default: true },
});

export const UserModel = models.User || model<User>("User", userSchema);
