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

export interface PrescribedMedicineData {
  medicineId: string;
  frequency: string;
  duration: string;
}

export interface PrescribedMedicineWithDetails extends PrescribedMedicineData {
  medicine: MedicineData;
}

export interface PrescriptionData {
  id?: string;
  appointmentId: string;
  prescribedMedicines: PrescribedMedicineData[];
  instructions: string;
}

export interface AppointmentWithPrescription extends AppointmentData {
  prescription?: Omit<PrescriptionData, "prescribedMedicines"> & {
    prescribedMedicines: (PrescribedMedicineData & {
      medicineDetails: MedicineData;
    })[];
  };
}
