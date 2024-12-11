export interface MedicineData {
  id?: string;
  name: string;
  dosageForm: string;
  strength: string;
  unitMeasurement: string;
  currentStock: number;
  reorderThreshold: number;
}

export interface AppointmentData {
  id?: string;
  patientId: string;
  doctorId: string;
  appointmentDate: Date;
  reasonForVisit: string;
  prescriptionId?: string;
}

export interface MedicineData {
  id?: string;
  name: string;
  dosageForm: string;
  strength: string;
  unitMeasurement: string;
  currentStock: number;
  reorderThreshold: number;
}

export interface MedicationData {
  medicineId: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface MedicationWithMedicine extends MedicationData {
  medicine: MedicineData;
}

export interface PrescriptionData {
  id?: string;
  appointmentId: string;
  medicines: MedicationData[];
  instructions: string;
}

export interface AppointmentWithPrescription extends AppointmentData {
  prescription?: Omit<PrescriptionData, "medicines"> & {
    medicines: (MedicationData & {
      medicineDetails: MedicineData;
    })[];
  };
}
