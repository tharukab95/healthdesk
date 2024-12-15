import { MongoDocument } from "../mongodb";

export type UserRole = "admin" | "doctor" | "dispenser";
export type PaymentStatus = "pending" | "paid" | "cancelled";
export type Gender = "male" | "female" | "other";

export interface User extends MongoDocument {
  name: string;
  email: string;
  image?: string;
  emailVerified?: Date;
  role: UserRole;
  isActive: boolean;
}

export interface Patient extends MongoDocument {
  firstName: string;
  lastName: string;
  contactNumber: string;
  age: number;
  gender: Gender;
  address: string;
  allergies: string[];
  medicalHistory: string[]; // Array of Appointment IDs
}

export interface Appointment extends MongoDocument {
  patientId: string;
  doctorId: string;
  appointmentDate: Date;
  reasonForVisit: string;
  prescriptionId?: string;
}

export interface PrescribedMedicine {
  medicineId: string;
  frequency: string;
  duration: string;
}

export interface Prescription extends MongoDocument {
  appointmentId: string;
  prescribedMedicines: PrescribedMedicine[];
  instructions: string;
}

export interface Medicine extends MongoDocument {
  name: string;
  dosageForm: string;
  strength: string;
  unitMeasurement: string;
  currentStock: number;
  reorderThreshold: number;
}

export interface MedicationCost {
  medicineId: string;
  cost: number;
}

export interface Billing extends MongoDocument {
  patientId: string;
  appointmentId: string;
  consultationFee: number;
  medicationCosts: MedicationCost[];
  totalAmount: number;
  paymentStatus: PaymentStatus;
  dateIssued: Date;
}
